import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, FilterQuery } from '@mikro-orm/core';
import { Match } from './entities/match.entity';
import { MatchLog, MatchLogAction } from './entities/match-log.entity';
import { User } from '../auth/entities/user.entity';
import { CreateMatchInput } from './dto/create-match.dto';
import { UpdateMatchInput } from './dto/update-match.dto';
import { MatchFilterInput, MatchActionInput } from './dto/match-filter.dto';
import { MatchStatus } from '../../common/enums/match-status.enum';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: EntityRepository<Match>,
    @InjectRepository(MatchLog)
    private readonly matchLogRepository: EntityRepository<MatchLog>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  /**
   * 새로운 경기 생성
   */
  async createMatch(createMatchInput: CreateMatchInput, hostId: string): Promise<Match> {
    // 호스트 사용자 확인
    const host = await this.userRepository.findOne(hostId);
    if (!host) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 날짜 유효성 검증
    const now = new Date();
    if (createMatchInput.scheduledAt <= now) {
      throw new BadRequestException('경기 일시는 현재 시간보다 미래여야 합니다.');
    }

    // 새 경기 생성
    const match = this.matchRepository.create({
      ...createMatchInput,
      host,
      status: MatchStatus.PENDING,
    });

    await this.matchRepository.persistAndFlush(match);

    // 경기 생성 로그 기록
    await this.createMatchLog(match, host, MatchLogAction.CREATED);

    return match;
  }

  /**
   * 경기 목록 조회 (필터링 및 페이지네이션 지원)
   */
  async findMatches(filter: MatchFilterInput): Promise<{
    matches: Match[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'ASC', ...filterOptions } = filter;

    // 필터 조건 구성
    const where: FilterQuery<Match> = {};

    if (filterOptions.status) {
      where.status = filterOptions.status;
    }

    if (filterOptions.type) {
      where.type = filterOptions.type;
    }

    if (filterOptions.locationType) {
      where.locationType = filterOptions.locationType;
    }

    if (filterOptions.hostId) {
      where.host = filterOptions.hostId;
    }

    if (filterOptions.startDate || filterOptions.endDate) {
      where.scheduledAt = {};
      if (filterOptions.startDate) {
        where.scheduledAt.$gte = filterOptions.startDate;
      }
      if (filterOptions.endDate) {
        where.scheduledAt.$lte = filterOptions.endDate;
      }
    }

    if (filterOptions.location) {
      where.location = { $ilike: `%${filterOptions.location}%` };
    }

    if (filterOptions.searchKeyword) {
      where.$or = [
        { title: { $ilike: `%${filterOptions.searchKeyword}%` } },
        { description: { $ilike: `%${filterOptions.searchKeyword}%` } },
      ];
    }

    // 총 개수 조회
    const total = await this.matchRepository.count(where);

    // 경기 목록 조회
    const matches = await this.matchRepository.find(where, {
      populate: ['host', 'opponent'],
      orderBy: { [sortBy]: sortOrder },
      limit,
      offset: (page - 1) * limit,
    });

    return {
      matches,
      total,
      page,
      limit,
    };
  }

  /**
   * 경기 상세 조회
   */
  async findMatchById(id: string): Promise<Match> {
    const match = await this.matchRepository.findOne(id, {
      populate: ['host', 'opponent'],
    });

    if (!match) {
      throw new NotFoundException('경기를 찾을 수 없습니다.');
    }

    return match;
  }

  /**
   * 경기 정보 수정
   */
  async updateMatch(updateMatchInput: UpdateMatchInput, userId: string): Promise<Match> {
    const { id, ...updateData } = updateMatchInput;

    const match = await this.findMatchById(id);

    // 호스트만 경기 정보를 수정할 수 있음
    if (match.host.id !== userId) {
      throw new ForbiddenException('경기 호스트만 경기 정보를 수정할 수 있습니다.');
    }

    // 이미 진행 중이거나 완료된 경기는 수정 불가
    if (match.status === MatchStatus.IN_PROGRESS || match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException('진행 중이거나 완료된 경기는 수정할 수 없습니다.');
    }

    // 날짜 유효성 검증 (날짜가 변경되는 경우)
    if (updateData.scheduledAt) {
      const now = new Date();
      if (updateData.scheduledAt <= now) {
        throw new BadRequestException('경기 일시는 현재 시간보다 미래여야 합니다.');
      }
    }

    // 경기 정보 업데이트
    Object.assign(match, updateData);
    await this.matchRepository.persistAndFlush(match);

    // 경기 수정 로그 기록
    const user = await this.userRepository.findOne(userId);
    await this.createMatchLog(match, user!, MatchLogAction.UPDATED);

    return match;
  }

  /**
   * 경기 삭제
   */
  async deleteMatch(id: string, userId: string): Promise<boolean> {
    const match = await this.findMatchById(id);

    // 호스트만 경기를 삭제할 수 있음
    if (match.host.id !== userId) {
      throw new ForbiddenException('경기 호스트만 경기를 삭제할 수 있습니다.');
    }

    // 이미 수락된 경기는 삭제 불가
    if (match.status === MatchStatus.ACCEPTED) {
      throw new BadRequestException('수락된 경기는 삭제할 수 없습니다. 대신 취소해주세요.');
    }

    await this.matchRepository.removeAndFlush(match);
    return true;
  }

  /**
   * 경기 매칭 수락
   */
  async acceptMatch(actionInput: MatchActionInput, userId: string): Promise<Match> {
    const { matchId, reason } = actionInput;
    const match = await this.findMatchById(matchId);

    // 호스트는 자신의 경기를 수락할 수 없음
    if (match.host.id === userId) {
      throw new BadRequestException('자신이 생성한 경기는 수락할 수 없습니다.');
    }

    // 이미 상대방이 있는 경기는 수락 불가
    if (match.opponent) {
      throw new BadRequestException('이미 상대방이 정해진 경기입니다.');
    }

    // PENDING 상태의 경기만 수락 가능
    if (match.status !== MatchStatus.PENDING) {
      throw new BadRequestException('대기 중인 경기만 수락할 수 있습니다.');
    }

    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 경기 수락 처리
    const previousStatus = match.status;
    match.opponent = user;
    match.status = MatchStatus.ACCEPTED;

    await this.matchRepository.persistAndFlush(match);

    // 경기 수락 로그 기록
    await this.createMatchLog(match, user, MatchLogAction.ACCEPTED, previousStatus, MatchStatus.ACCEPTED, reason);

    return match;
  }

  /**
   * 경기 매칭 거절
   */
  async rejectMatch(actionInput: MatchActionInput, userId: string): Promise<Match> {
    const { matchId, reason } = actionInput;
    const match = await this.findMatchById(matchId);

    // 호스트는 자신의 경기를 거절할 수 없음
    if (match.host.id === userId) {
      throw new BadRequestException('자신이 생성한 경기는 거절할 수 없습니다.');
    }

    // PENDING 상태의 경기만 거절 가능
    if (match.status !== MatchStatus.PENDING) {
      throw new BadRequestException('대기 중인 경기만 거절할 수 있습니다.');
    }

    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 경기 거절 처리
    const previousStatus = match.status;
    match.status = MatchStatus.REJECTED;

    await this.matchRepository.persistAndFlush(match);

    // 경기 거절 로그 기록
    await this.createMatchLog(match, user, MatchLogAction.REJECTED, previousStatus, MatchStatus.REJECTED, reason);

    return match;
  }

  /**
   * 경기 취소
   */
  async cancelMatch(actionInput: MatchActionInput, userId: string): Promise<Match> {
    const { matchId, reason } = actionInput;
    const match = await this.findMatchById(matchId);

    // 호스트 또는 상대방만 경기를 취소할 수 있음
    if (match.host.id !== userId && match.opponent?.id !== userId) {
      throw new ForbiddenException('경기 참여자만 경기를 취소할 수 있습니다.');
    }

    // 이미 진행 중이거나 완료된 경기는 취소 불가
    if (match.status === MatchStatus.IN_PROGRESS || match.status === MatchStatus.COMPLETED) {
      throw new BadRequestException('진행 중이거나 완료된 경기는 취소할 수 없습니다.');
    }

    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 경기 취소 처리
    const previousStatus = match.status;
    match.status = MatchStatus.CANCELLED;

    await this.matchRepository.persistAndFlush(match);

    // 경기 취소 로그 기록
    await this.createMatchLog(match, user, MatchLogAction.CANCELLED, previousStatus, MatchStatus.CANCELLED, reason);

    return match;
  }

  /**
   * 경기 시작
   */
  async startMatch(matchId: string, userId: string): Promise<Match> {
    const match = await this.findMatchById(matchId);

    // 호스트만 경기를 시작할 수 있음
    if (match.host.id !== userId) {
      throw new ForbiddenException('경기 호스트만 경기를 시작할 수 있습니다.');
    }

    // 수락된 경기만 시작 가능
    if (match.status !== MatchStatus.ACCEPTED) {
      throw new BadRequestException('수락된 경기만 시작할 수 있습니다.');
    }

    // 경기 시작 처리
    const previousStatus = match.status;
    match.status = MatchStatus.IN_PROGRESS;

    await this.matchRepository.persistAndFlush(match);

    // 경기 시작 로그 기록
    const user = await this.userRepository.findOne(userId);
    await this.createMatchLog(match, user!, MatchLogAction.STARTED, previousStatus, MatchStatus.IN_PROGRESS);

    return match;
  }

  /**
   * 경기 완료
   */
  async completeMatch(matchId: string, userId: string, hostScore?: number, opponentScore?: number): Promise<Match> {
    const match = await this.findMatchById(matchId);

    // 호스트만 경기를 완료할 수 있음
    if (match.host.id !== userId) {
      throw new ForbiddenException('경기 호스트만 경기를 완료할 수 있습니다.');
    }

    // 진행 중인 경기만 완료 가능
    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new BadRequestException('진행 중인 경기만 완료할 수 있습니다.');
    }

    // 경기 완료 처리
    const previousStatus = match.status;
    match.status = MatchStatus.COMPLETED;
    match.completedAt = new Date();

    if (hostScore !== undefined) {
      match.hostScore = hostScore;
    }
    if (opponentScore !== undefined) {
      match.opponentScore = opponentScore;
    }

    await this.matchRepository.persistAndFlush(match);

    // 경기 완료 로그 기록
    const user = await this.userRepository.findOne(userId);
    await this.createMatchLog(match, user!, MatchLogAction.COMPLETED, previousStatus, MatchStatus.COMPLETED);

    return match;
  }

  /**
   * 사용자별 경기 목록 조회
   */
  async findUserMatches(userId: string, filter: MatchFilterInput): Promise<{
    matches: Match[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20, sortBy = 'scheduledAt', sortOrder = 'ASC', ...filterOptions } = filter;

    // 사용자가 호스트이거나 상대방인 경기 조회
    const where: FilterQuery<Match> = {
      $or: [
        { host: userId },
        { opponent: userId },
      ],
    };

    // 추가 필터 적용
    if (filterOptions.status) {
      where.status = filterOptions.status;
    }

    if (filterOptions.type) {
      where.type = filterOptions.type;
    }

    const total = await this.matchRepository.count(where);

    const matches = await this.matchRepository.find(where, {
      populate: ['host', 'opponent'],
      orderBy: { [sortBy]: sortOrder },
      limit,
      offset: (page - 1) * limit,
    });

    return {
      matches,
      total,
      page,
      limit,
    };
  }

  /**
   * 경기 로그 생성 (내부 메서드)
   */
  private async createMatchLog(
    match: Match,
    user: User,
    action: MatchLogAction,
    previousStatus?: MatchStatus,
    newStatus?: MatchStatus,
    reason?: string,
    metadata?: Record<string, any>,
  ): Promise<MatchLog> {
    const log = this.matchLogRepository.create({
      match,
      user,
      action,
      previousStatus,
      newStatus,
      reason,
      metadata,
    });

    await this.matchLogRepository.persistAndFlush(log);
    return log;
  }

  /**
   * 경기 로그 조회
   */
  async findMatchLogs(matchId: string): Promise<MatchLog[]> {
    return this.matchLogRepository.find(
      { match: matchId },
      {
        populate: ['user'],
        orderBy: { createdAt: 'ASC' },
      },
    );
  }
} 