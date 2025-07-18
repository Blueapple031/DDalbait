import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Enum,
  BeforeCreate,
} from '@mikro-orm/core';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import { User } from '../../auth/entities/user.entity';
import { Match } from './match.entity';
import { MatchStatus } from '../../../common/enums/match-status.enum';

export enum MatchLogAction {
  CREATED = 'CREATED',           // 경기 생성됨
  ACCEPTED = 'ACCEPTED',         // 경기 수락됨
  REJECTED = 'REJECTED',         // 경기 거절됨
  CANCELLED = 'CANCELLED',       // 경기 취소됨
  STARTED = 'STARTED',           // 경기 시작됨
  COMPLETED = 'COMPLETED',       // 경기 완료됨
  UPDATED = 'UPDATED',           // 경기 정보 수정됨
}

registerEnumType(MatchLogAction, {
  name: 'MatchLogAction',
  description: '경기 로그 액션',
});

@ObjectType('MatchLog')
@Entity()
export class MatchLog {
  @Field(() => ID)
  @PrimaryKey()
  id!: string;

  // 관련 경기
  @Field(() => Match)
  @ManyToOne(() => Match, { onDelete: 'cascade' })
  match!: Match;

  // 액션을 수행한 사용자
  @Field(() => User)
  @ManyToOne(() => User)
  user!: User;

  // 수행된 액션
  @Field(() => MatchLogAction)
  @Enum(() => MatchLogAction)
  action!: MatchLogAction;

  // 이전 상태 (상태 변경 시)
  @Field(() => MatchStatus, { nullable: true })
  @Enum(() => MatchStatus)
  previousStatus?: MatchStatus;

  // 새로운 상태 (상태 변경 시)
  @Field(() => MatchStatus, { nullable: true })
  @Enum(() => MatchStatus)
  newStatus?: MatchStatus;

  // 액션에 대한 설명/사유
  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  reason?: string;

  // 추가 메타데이터 (JSON)
  @Field({ nullable: true })
  @Property({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  // 로그 생성 시간
  @Field()
  @Property()
  createdAt!: Date;

  @BeforeCreate()
  setDefaults() {
    if (!this.id) {
      this.id = randomUUID();
    }
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  constructor(partial?: Partial<MatchLog>) {
    Object.assign(this, partial);
  }
} 