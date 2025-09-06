import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '@auth/public.decorator'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const can = (await super.canActivate(context)) as boolean
    if (!can) return false

    const request = context.switchToHttp().getRequest()
    const user = request.user as { id?: number } | undefined
    if (!user?.id) {
      throw new UnauthorizedException('Missing or invalid authentication token')
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (!dbUser || dbUser.role !== 'ADMIN') {
      throw new ForbiddenException('Admin only')
    }

    return true
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException('Missing or invalid authentication token')
    }
    return user
  }
}
