import { InputType, Field, PartialType } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { CreateMatchInput } from './create-match.dto';
import { MatchStatus } from '../../../common/enums/match-status.enum';

@InputType()
export class UpdateMatchInput extends PartialType(CreateMatchInput) {
  @Field()
  @IsString()
  id!: string;

  @Field(() => MatchStatus, { nullable: true })
  @IsOptional()
  @IsEnum(MatchStatus, { message: '올바른 경기 상태를 선택해주세요.' })
  status?: MatchStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  opponentId?: string; // 상대방 ID

  @Field({ nullable: true })
  @IsOptional()
  hostScore?: number; // 호스트 팀 점수

  @Field({ nullable: true })
  @IsOptional()
  opponentScore?: number; // 상대 팀 점수
} 