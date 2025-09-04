import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { AuthService } from '@auth/auth.service'
import type { KakaoUserPayload } from '@auth/auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async kakaoLogin() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req: Request, @Res() res: Response) {
    const user = (req as any).user as KakaoUserPayload
    const jwt = await this.authService.signInWithKakao(user)
    const cookieName = this.config.get<string>('JWT_COOKIE_NAME') || 'token'
    const isProd =
      (this.config.get<string>('NODE_ENV') || 'development') === 'production'
    const cookieDomain =
      this.config.get<string>('COOKIE_DOMAIN') || '.joodang.com'
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000 // 7 days

    res.cookie(cookieName, jwt, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain: isProd ? cookieDomain : 'localhost',
      path: '/',
      maxAge: maxAgeMs,
    })

    const fallback = 'http://localhost:3000/oauth/kakao'
    const redirectBase =
      this.config.get<string>('KAKAO_REDIRECT_URL') || fallback
    return res.redirect(redirectBase)
  }

  @Post('kakao/signin/test')
  async signInForTest(@Body() userPayload: KakaoUserPayload) {
    const jwt = await this.authService.signInWithKakao(userPayload);
    return {
      message: 'Test sign-in successful. Use this accessToken for other APIs.',
      accessToken: jwt,
    }
  }
}
