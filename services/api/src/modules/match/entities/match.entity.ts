import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  ManyToOne,
  OneToMany,
  Collection,
  BeforeCreate,
  BeforeUpdate,
} from '@mikro-orm/core';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import { User } from '../../auth/entities/user.entity';
import { MatchStatus } from '../../../common/enums/match-status.enum';
import { MatchType } from '../../../common/enums/match-type.enum';
import { MatchLocation } from '../../../common/enums/match-location.enum';

// GraphQL에서 Enum 사용을 위한 등록
registerEnumType(MatchStatus, {
  name: 'MatchStatus',
  description: '경기 상태',
});

registerEnumType(MatchType, {
  name: 'MatchType',
  description: '경기 유형',
});

registerEnumType(MatchLocation, {
  name: 'MatchLocation',
  description: '경기 장소 유형',
});

@ObjectType('Match')
@Entity()
export class Match {
  @Field(() => ID)
  @PrimaryKey()
  id!: string;

  @Field()
  @Property()
  title!: string; // 경기 제목

  @Field()
  @Property({ type: 'text', nullable: true })
  description?: string; // 경기 설명

  @Field()
  @Property()
  scheduledAt!: Date; // 경기 예정 일시

  @Field()
  @Property()
  location!: string; // 구체적인 경기 장소 (예: "부산대학교 체육관 1층")

  @Field(() => MatchLocation)
  @Enum(() => MatchLocation)
  locationType!: MatchLocation; // 장소 유형

  @Field({ nullable: true })
  @Property({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number; // GPS 위도

  @Field({ nullable: true })
  @Property({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number; // GPS 경도

  @Field(() => MatchType)
  @Enum(() => MatchType)
  type!: MatchType; // 경기 유형

  @Field(() => MatchStatus)
  @Enum(() => MatchStatus)
  status!: MatchStatus; // 경기 상태

  @Field()
  @Property()
  maxPlayers!: number; // 최대 참가 인원 (기본 10명)

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  rules?: string; // 경기 룰 설명

  @Field({ nullable: true })
  @Property({ nullable: true })
  videoUrl?: string; // 경기 영상 URL

  @Field({ nullable: true })
  @Property({ nullable: true })
  thumbnailUrl?: string; // 썸네일 이미지 URL

  // 경기 생성자 (호스트)
  @Field(() => User)
  @ManyToOne(() => User)
  host!: User;

  // 상대방 (매칭된 사용자/팀)
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true })
  opponent?: User;

  // 경기 참가자 목록 (추후 별도 엔티티로 확장 가능)
  @Field({ nullable: true })
  @Property({ type: 'json', nullable: true })
  participants?: string[]; // 참가자 ID 배열

  // 경기 결과 정보
  @Field({ nullable: true })
  @Property({ nullable: true })
  hostScore?: number; // 호스트 팀 점수

  @Field({ nullable: true })
  @Property({ nullable: true })
  opponentScore?: number; // 상대 팀 점수

  @Field({ nullable: true })
  @Property({ type: 'json', nullable: true })
  gameStats?: Record<string, any>; // 경기 상세 통계 (JSON)

  // 메타데이터
  @Field()
  @Property()
  createdAt!: Date;

  @Field()
  @Property({ onUpdate: () => new Date() })
  updatedAt!: Date;

  @Field({ nullable: true })
  @Property({ nullable: true })
  completedAt?: Date; // 경기 완료 시간

  @BeforeCreate()
  @BeforeUpdate()
  updateTimestamps() {
    const now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
      this.id = randomUUID();
    }
    this.updatedAt = now;
  }

  // 기본값 설정
  constructor() {
    this.status = MatchStatus.PENDING;
    this.maxPlayers = 10;
  }
} 