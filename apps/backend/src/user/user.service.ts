import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { ApplyOwnerDto } from './dto/apply-owner.dto'
import { Role } from '@prisma/client'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async getUserRole(userId: number) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { role: true },
    })
  }

  async applyForOwner(userId: number, applyOwnerDto: ApplyOwnerDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.role === Role.OWNER) {
      throw new ConflictException('User is already an owner')
    }

    const applicationCreated = await this.prisma.ownerApplication.create({
      data: {
        userId,
        phone: applyOwnerDto.phone,
        organizer: applyOwnerDto.organizer,
      },
    })

    this.eventEmitter.emit('owner.applied')

    return applicationCreated
  }

  async confirmOwnerApplication(applicationId: number) {
    const application = await this.prisma.ownerApplication.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      throw new NotFoundException('Application not found')
    }

    const [, applicationConfirmed] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: application.userId },
        data: { role: Role.OWNER, phone: application.phone },
      }),
      this.prisma.ownerApplication.update({
        where: { id: applicationId },
        data: { isConfirmed: true },
      }),
    ])

    this.eventEmitter.emit('owner.confirmed', {
      userId: application.userId,
    })

    return applicationConfirmed
  }

  async getOwnerApplications(isConfirmed?: boolean) {
    return this.prisma.ownerApplication.findMany({
      where: { isConfirmed },
    })
  }
}
