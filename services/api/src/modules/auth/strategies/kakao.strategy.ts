import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      clientSecret: configService.get<string>('KAKAO_CLIENT_SECRET'),
      callbackURL: '/auth/kakao/callback',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { id, username, _json } = profile;
    
    const user = {
      kakaoId: id,
      email: _json.kakao_account?.email,
      fullName: _json.kakao_account?.profile?.nickname || username,
      username: username || _json.kakao_account?.profile?.nickname,
      profileImage: _json.kakao_account?.profile?.profile_image_url,
      accessToken,
    };
    
    done(null, user);
  }
} 