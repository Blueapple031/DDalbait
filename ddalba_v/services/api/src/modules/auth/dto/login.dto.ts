import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  email!: string;

  @Field()
  @IsString()
  @MinLength(1, { message: '비밀번호를 입력해주세요.' })
  password!: string;
} 