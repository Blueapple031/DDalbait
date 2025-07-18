import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { MatchService } from './match.service';
import { Match } from './entities/match.entity';
import { MatchLog } from './entities/match-log.entity';
import { CreateMatchInput } from './dto/create-match.dto';
import { UpdateMatchInput } from './dto/update-match.dto';
import { MatchFilterInput, MatchActionInput } from './dto/match-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => Match)
@UseGuards(JwtAuthGuard)
export class MatchResolver {
  constructor(private readonly matchService: MatchService) {}

  /**
   * 새로운 경기 생성
   */
  @Mutation(() => Match)
  async createMatch(
    @Args('input') createMatchInput: CreateMatchInput,
    @CurrentUser() user: User,
  ): Promise<Match> {
    return this.matchService.createMatch(createMatchInput, user.id);
  }

  /**
   * 경기 목록 조회 (필터링 및 페이지네이션)
   */
  @Query(() => MatchListResponse)
  async matches(
    @Args('filter', { nullable: true }) filter: MatchFilterInput = {},
  ): Promise<MatchListResponse> {
    const result = await this.matchService.findMatches(filter);
    return {
      matches: result.matches,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  /**
   * 경기 상세 조회
   */
  @Query(() => Match)
  async match(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Match> {
    return this.matchService.findMatchById(id);
  }

  /**
   * 내 경기 목록 조회
   */
  @Query(() => MatchListResponse)
  async myMatches(
    @Args('filter', { nullable: true }) filter: MatchFilterInput = {},
    @CurrentUser() user: User,
  ): Promise<MatchListResponse> {
    const result = await this.matchService.findUserMatches(user.id, filter);
    return {
      matches: result.matches,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      },
    };
  }

  /**
   * 경기 정보 수정
   */
  @Mutation(() => Match)
  async updateMatch(
    @Args('input') updateMatchInput: UpdateMatchInput,
    @CurrentUser() user: User,
  ): Promise<Match> {
    return this.matchService.updateMatch(updateMatchInput, user.id);
  }

  /**
   * 경기 삭제
   */
  @Mutation(() => Boolean)
  async deleteMatch(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.matchService.deleteMatch(id, user.id);
  }

  /**
   * 경기 수락
   */
  @Mutation(() => Match)
  async acceptMatch(
    @Args('input') actionInput: MatchActionInput,
    @CurrentUser() user: User,
  ): Promise<Match> {
    return this.matchService.acceptMatch(actionInput, user.id);
  }

  /**
   * 경기 거절
   */
  @Mutation(() => Match)
  async rejectMatch(
    @Args('input') actionInput: MatchActionInput,
    @CurrentUser() user: User,
  ): Promise<Match> {
    return this.matchService.rejectMatch(actionInput, user.id);
  }

  /**
   * 경기 취소
   */
  @Mutation(() => Match)
  async cancelMatch(
    @Args('input') actionInput: MatchActionInput,
    @CurrentUser() user: User,
  ): Promise<Match> {
    return this.matchService.cancelMatch(actionInput, user.id);
  }

  /**
   * 경기 시작
   */
  @Mutation(() => Match)
  async startMatch(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Match> {
    return this.matchService.startMatch(id, user.id);
  }

  /**
   * 경기 완료
   */
  @Mutation(() => Match)
  async completeMatch(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @Args('hostScore', { nullable: true }) hostScore?: number,
    @Args('opponentScore', { nullable: true }) opponentScore?: number,
    @CurrentUser() user?: User,
  ): Promise<Match> {
    return this.matchService.completeMatch(id, user!.id, hostScore, opponentScore);
  }

  /**
   * 경기 로그 조회
   */
  @Query(() => [MatchLog])
  async matchLogs(
    @Args('matchId', { type: () => ID }, ParseUUIDPipe) matchId: string,
  ): Promise<MatchLog[]> {
    return this.matchService.findMatchLogs(matchId);
  }
}

// GraphQL Response Types
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PaginationInfo {
  @Field()
  total!: number;

  @Field()
  page!: number;

  @Field()
  limit!: number;

  @Field()
  totalPages!: number;
}

@ObjectType()
export class MatchListResponse {
  @Field(() => [Match])
  matches!: Match[];

  @Field(() => PaginationInfo)
  pagination!: PaginationInfo;
} 