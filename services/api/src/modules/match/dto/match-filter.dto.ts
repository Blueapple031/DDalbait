import { InputType, Field } from '@nestjs/graphql';
import {
  IsOptional,
  IsEnum,
  IsDate,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MatchStatus } from '../../../common/enums/match-status.enum';
import { MatchType } from '../../../common/enums/match-type.enum';
import { MatchLocation } from '../../../common/enums/match-location.enum';

@InputType()
export class MatchFilterInput {
  @Field(() => MatchStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MatchStatus)
  status?: MatchStatus;

  @Field(() => MatchType, { nullable: true })
  @IsOptional()
  @IsEnum(MatchType)
  type?: MatchType;

  @Field(() => MatchLocation, { nullable: true })
  @IsOptional()
  @IsEnum(MatchLocation)
  locationType?: MatchLocation;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date; // 검색 시작 날짜

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date; // 검색 종료 날짜

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string; // 장소 키워드 검색

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  hostId?: string; // 특정 호스트의 경기만

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  searchKeyword?: string; // 제목 또는 설명 키워드 검색

  // 페이지네이션
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // 정렬
  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['createdAt', 'scheduledAt', 'updatedAt'])
  sortBy?: 'createdAt' | 'scheduledAt' | 'updatedAt' = 'scheduledAt';

  @Field({ nullable: true })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

@InputType()
export class MatchActionInput {
  @Field()
  @IsString()
  matchId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  reason?: string; // 수락/거절/취소 사유
} 