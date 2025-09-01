import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

type JwtPayload = {
  sub: number
  kakaoId?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    const cookieName = config.get<string>('JWT_COOKIE_NAME') || 'token'
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req?.cookies ? (req.cookies as any)[cookieName] : null,
        (req: Request) =>
          req?.cookies ? (req.cookies as any)['jd_token'] : null,
        (req: Request) => (req?.cookies ? (req.cookies as any)['token'] : null),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: config.get<string>('JWT_SECRET') || 'dev-secret',
      ignoreExpiration: false,
      passReqToCallback: false,
    })
  }

  async validate(payload: JwtPayload) {
    return { id: payload.sub, kakaoId: payload.kakaoId }
  }
}
