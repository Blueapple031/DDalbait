import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterInput } from './dto/register.dto';
import { LoginInput } from './dto/login.dto';
import { AuthResponse, RefreshTokenResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const { email, password, username, fullName, phoneNumber } = registerInput;

    // 이메일 중복 검사
    const existingUserByEmail = await this.userRepository.findOne({ email });
    if (existingUserByEmail) {
      throw new ConflictException('이미 사용 중인 이메일입니다.');
    }

    // 사용자명 중복 검사
    const existingUserByUsername = await this.userRepository.findOne({ username });
    if (existingUserByUsername) {
      throw new ConflictException('이미 사용 중인 사용자명입니다.');
    }

    // 비밀번호 해시
    const hashedPassword = await this.hashPassword(password);

    // 사용자 생성
    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.username = username;
    user.fullName = fullName;
    user.phoneNumber = phoneNumber;
    user.emailVerificationToken = this.generateEmailVerificationToken();

    await this.userRepository.persistAndFlush(user);

    // TODO: 이메일 인증 메일 발송

    return this.generateAuthResponse(user);
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    // 사용자 조회
    const user = await this.userRepository.findOne({ email });
    if (!user || !user.password) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 계정 활성화 확인
    if (!user.isActive) {
      throw new UnauthorizedException('비활성화된 계정입니다.');
    }

    // 마지막 로그인 시간 업데이트
    user.updateLastLogin();
    await this.userRepository.persistAndFlush(user);

    return this.generateAuthResponse(user);
  }

  async validateOAuthLogin(oauthUser: any, provider: string): Promise<AuthResponse> {
    let user: User;

    if (provider === 'google') {
      user = await this.userRepository.findOne({ googleId: oauthUser.googleId });
    } else if (provider === 'kakao') {
      user = await this.userRepository.findOne({ kakaoId: oauthUser.kakaoId });
    }

    if (!user) {
      // 기존 이메일로 계정이 있는지 확인
      const existingUser = await this.userRepository.findOne({ email: oauthUser.email });
      
      if (existingUser) {
        // 기존 계정에 OAuth ID 연결
        if (provider === 'google') {
          existingUser.googleId = oauthUser.googleId;
        } else if (provider === 'kakao') {
          existingUser.kakaoId = oauthUser.kakaoId;
        }
        
        existingUser.profileImage = existingUser.profileImage || oauthUser.profileImage;
        existingUser.isEmailVerified = true;
        existingUser.updateLastLogin();
        
        await this.userRepository.persistAndFlush(existingUser);
        return this.generateAuthResponse(existingUser);
      } else {
        // 새로운 사용자 생성
        user = new User();
        user.email = oauthUser.email;
        user.fullName = oauthUser.fullName;
        user.username = await this.generateUniqueUsername(oauthUser.username);
        user.profileImage = oauthUser.profileImage;
        user.isEmailVerified = true;
        
        if (provider === 'google') {
          user.googleId = oauthUser.googleId;
        } else if (provider === 'kakao') {
          user.kakaoId = oauthUser.kakaoId;
        }
        
        user.updateLastLogin();
        await this.userRepository.persistAndFlush(user);
      }
    } else {
      // 기존 OAuth 사용자 로그인
      user.updateLastLogin();
      await this.userRepository.persistAndFlush(user);
    }

    return this.generateAuthResponse(user);
  }

  async refreshToken(refreshTokenValue: string): Promise<RefreshTokenResponse> {
    // Refresh Token 조회
    const refreshToken = await this.refreshTokenRepository.findOne(
      { token: refreshTokenValue },
      { populate: ['user'] }
    );

    if (!refreshToken || !refreshToken.isValid()) {
      throw new UnauthorizedException('유효하지 않은 refresh token입니다.');
    }

    // 기존 토큰 무효화
    refreshToken.revoke();
    await this.refreshTokenRepository.persistAndFlush(refreshToken);

    // 새로운 토큰 생성
    const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(
      refreshToken.user
    );

    const expiresIn = this.configService.get<string>('auth.jwtExpirationTime');
    const expiresInSeconds = this.parseExpirationTime(expiresIn || '15m');

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: expiresInSeconds,
    };
  }

  async logout(refreshTokenValue: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      token: refreshTokenValue,
    });

    if (refreshToken) {
      refreshToken.revoke();
      await this.refreshTokenRepository.persistAndFlush(refreshToken);
    }

    return true;
  }

  async logoutAllDevices(userId: string): Promise<boolean> {
    const refreshTokens = await this.refreshTokenRepository.find({
      user: userId,
      isRevoked: false,
    });

    refreshTokens.forEach(token => token.revoke());
    await this.refreshTokenRepository.persistAndFlush(refreshTokens);

    return true;
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ id: userId, isActive: true });
  }

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const { accessToken, refreshToken } = await this.generateTokens(user);
    
    const expiresIn = this.configService.get<string>('auth.jwtExpirationTime');
    const expiresInSeconds = this.parseExpirationTime(expiresIn || '15m');

    return {
      accessToken,
      refreshToken,
      user,
      expiresIn: expiresInSeconds,
    };
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Access Token 생성
    const accessToken = this.jwtService.sign(payload);

    // Refresh Token 생성
    const refreshTokenValue = crypto.randomBytes(64).toString('hex');
    const refreshToken = new RefreshToken();
    refreshToken.token = refreshTokenValue;
    refreshToken.user = user;

    await this.refreshTokenRepository.persistAndFlush(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>('auth.bcryptSaltRounds') || 10;
    return bcrypt.hash(password, saltRounds);
  }

  private generateEmailVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async generateUniqueUsername(baseUsername: string): Promise<string> {
    let username = baseUsername;
    let counter = 1;

    while (await this.userRepository.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  }

  private parseExpirationTime(expirationTime: string): number {
    const unit = expirationTime.slice(-1);
    const value = parseInt(expirationTime.slice(0, -1));

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return 900; // 15 minutes default
    }
  }
} 