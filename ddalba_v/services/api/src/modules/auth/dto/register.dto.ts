import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: '올바른 이메일 형식을 입력해주세요.' })
  email!: string;

  @Field()
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(50, { message: '비밀번호는 최대 50자까지 입력 가능합니다.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password!: string;

  @Field()
  @IsString()
  @MinLength(2, { message: '사용자명은 최소 2자 이상이어야 합니다.' })
  @MaxLength(20, { message: '사용자명은 최대 20자까지 입력 가능합니다.' })
  @Matches(/^[a-zA-Z0-9가-힣_]+$/, {
    message: '사용자명은 영문, 한글, 숫자, 언더스코어만 사용 가능합니다.',
  })
  username!: string;

  @Field()
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상이어야 합니다.' })
  @MaxLength(30, { message: '이름은 최대 30자까지 입력 가능합니다.' })
  fullName!: string;

  @Field({ nullable: true })
  @IsString()
  @Matches(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, {
    message: '올바른 휴대폰 번호 형식을 입력해주세요.',
  })
  phoneNumber?: string;
} 