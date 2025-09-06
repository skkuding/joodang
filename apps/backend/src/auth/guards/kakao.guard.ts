import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { encryptState } from '@auth/oauth-state.util'

@Injectable()
export class KakaoAuthGuard extends AuthGuard('kakao') {
  constructor(private readonly config: ConfigService) {
    super()
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const returnTo = (req?.query?.returnTo as string | undefined) || ''
    if (!returnTo) return {}

    const statePayload = {
      returnTo,
      nonce: Math.random().toString(36).slice(2),
      ts: Date.now(),
    }
    const secret =
      this.config.get<string>('KAKAO_CLIENT_SECRET') || 'dev-secret'
    const state = encryptState(statePayload, secret)
    return { state }
  }
}
