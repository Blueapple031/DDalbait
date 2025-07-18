import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsDate,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsUrl,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MatchType } from '../../../common/enums/match-type.enum';
import { MatchLocation } from '../../../common/enums/match-location.enum';

@InputType()
export class CreateMatchInput {
  @Field()
  @IsString()
  @MaxLength(100, { message: '경기 제목은 최대 100자까지 입력 가능합니다.' })
  title!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: '경기 설명은 최대 1000자까지 입력 가능합니다.' })
  description?: string;

  @Field()
  @Type(() => Date)
  @IsDate({ message: '올바른 날짜 형식을 입력해주세요.' })
  scheduledAt!: Date;

  @Field()
  @IsString()
  @MaxLength(200, { message: '경기 장소는 최대 200자까지 입력 가능합니다.' })
  location!: string;

  @Field(() => MatchLocation)
  @IsEnum(MatchLocation, { message: '올바른 장소 유형을 선택해주세요.' })
  locationType!: MatchLocation;

  @Field({ nullable: true })
  @IsOptional()
  @IsLatitude({ message: '올바른 위도 값을 입력해주세요.' })
  latitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsLongitude({ message: '올바른 경도 값을 입력해주세요.' })
  longitude?: number;

  @Field(() => MatchType)
  @IsEnum(MatchType, { message: '올바른 경기 유형을 선택해주세요.' })
  type!: MatchType;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: '최대 참가 인원은 숫자여야 합니다.' })
  @Min(2, { message: '최대 참가 인원은 2명 이상이어야 합니다.' })
  @Max(50, { message: '최대 참가 인원은 50명을 초과할 수 없습니다.' })
  maxPlayers?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: '경기 룰은 최대 2000자까지 입력 가능합니다.' })
  rules?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: '올바른 URL 형식을 입력해주세요.' })
  videoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: '올바른 URL 형식을 입력해주세요.' })
  thumbnailUrl?: string;
} 