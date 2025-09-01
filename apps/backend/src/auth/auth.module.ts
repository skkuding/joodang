import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { KakaoStrategy } from '@auth/kakao.strategy'
import { AuthController } from '@auth/auth.controller'
import { PrismaModule } from '@prisma/prisma.module'
import { AuthService } from '@auth/auth.service'
import { JwtStrategy } from '@auth/jwt.strategy'
import { JwtAuthGuard } from '@auth/jwt.guard'
import { OptionalJwtAuthGuard } from '@auth/optional-jwt.guard'

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'dev-secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    PrismaModule,
  ],
  providers: [
    KakaoStrategy,
    JwtStrategy,
    AuthService,
    JwtAuthGuard,
    OptionalJwtAuthGuard,
  ],
  controllers: [AuthController],
  exports: [JwtAuthGuard, OptionalJwtAuthGuard],
})
export class AuthModule {}
