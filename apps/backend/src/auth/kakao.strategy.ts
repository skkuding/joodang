import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-kakao'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly config: ConfigService) {
    super({
      clientID: config.get<string>('KAKAO_CLIENT_ID') as string,
      clientSecret: config.get<string>('KAKAO_CLIENT_SECRET') || undefined,
      callbackURL: config.get<string>('KAKAO_CALLBACK_URL') as string,
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const kakaoId = String(profile.id)
      const name = profile.username ?? 'KakaoUser'
      const profileImageUrl =
        (profile._json as any)?.kakao_account?.profile?.profile_image_url ??
        null

      const user = { kakaoId, name, profileImageUrl }
      done(null, user)
    } catch (err) {
      done(err, false)
    }
  }
}
