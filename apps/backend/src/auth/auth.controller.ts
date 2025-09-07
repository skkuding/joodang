import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '@auth/auth.service'
import { decryptState, safeReturnTo } from '@auth/oauth-state.util'
import { KakaoAuthGuard } from '@app/auth/guards/kakao.guard'
import type { KakaoUserPayload } from '@auth/auth.service'
import { JwtAuthGuard } from './guards/jwt.guard'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieName = this.config.get<string>('JWT_COOKIE_NAME') || 'token'
    const isProd =
      (this.config.get<string>('NODE_ENV') || 'development') === 'production'
    const cookieDomain = '.joodang.com'

    res.cookie(cookieName, '', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: isProd ? cookieDomain : 'localhost',
      path: '/',
      maxAge: 0,
    })

    return { ok: true }
  }

  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('state') stateToken: string,
  ) {
    const user = (req as any).user as KakaoUserPayload
    const jwt = await this.authService.signInWithKakao(user)
    const cookieName = this.config.get<string>('JWT_COOKIE_NAME') || 'token'
    const isProd =
      (this.config.get<string>('NODE_ENV') || 'development') === 'production'
    const cookieDomain = '.joodang.com'
    const maxAgeMs = 14 * 24 * 60 * 60 * 1000 // 14 days

    res.cookie(cookieName, jwt, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: isProd ? cookieDomain : 'localhost',
      path: '/',
      maxAge: maxAgeMs,
    })

    const redirectBase =
      this.config.get<string>('KAKAO_REDIRECT_URL') ||
      'https://joodang.com/auth/kakao'

    let redirectUrl = redirectBase
    if (stateToken) {
      const secret =
        this.config.get<string>('KAKAO_CLIENT_SECRET') || 'dev-secret'
      const payload = decryptState<{ returnTo?: string }>(stateToken, secret)
      if (payload?.returnTo) {
        redirectUrl +=
          safeReturnTo(payload.returnTo, redirectBase.replace(/\/$/, '')) ?? ''
      }
    }
    return res.redirect(redirectUrl)
  }
}
