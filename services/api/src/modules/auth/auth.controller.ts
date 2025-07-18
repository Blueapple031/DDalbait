import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(): Promise<void> {
    // Guard가 Google OAuth 페이지로 리다이렉트
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result = await this.authService.validateOAuthLogin(req.user, 'google');
      
      // 클라이언트로 토큰과 함께 리다이렉트
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${result.accessToken}&refreshToken=${result.refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/auth/error`);
    }
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuth(): Promise<void> {
    // Guard가 Kakao OAuth 페이지로 리다이렉트
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result = await this.authService.validateOAuthLogin(req.user, 'kakao');
      
      // 클라이언트로 토큰과 함께 리다이렉트
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${result.accessToken}&refreshToken=${result.refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/auth/error`);
    }
  }
} 