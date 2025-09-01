import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@prisma/prisma.service'

export type KakaoUserPayload = {
  kakaoId: string
  name: string | null
  profileImageUrl: string | null
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signInWithKakao(user: KakaoUserPayload): Promise<string> {
    const dbUser = await this.prisma.user.upsert({
      where: { kakaoId: user.kakaoId },
      update: {
        name: user.name ?? undefined,
        profileImageUrl: user.profileImageUrl ?? undefined,
      },
      create: {
        kakaoId: user.kakaoId,
        name: user.name ?? 'KakaoUser',
        profileImageUrl: user.profileImageUrl,
      },
    })

    const payload = { sub: dbUser.id as number, kakaoId: dbUser.kakaoId }
    return await this.jwt.signAsync(payload)
  }
}
