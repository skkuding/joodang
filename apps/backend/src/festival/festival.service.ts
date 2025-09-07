import { Injectable } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'

@Injectable()
export class FestivalService {
  constructor(private readonly prisma: PrismaService) {}

  async getFestivals(cursor: number | null, take: number) {
    const paginator = this.prisma.getPaginator(cursor)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return await this.prisma.festival.findMany({
      ...paginator,
      take,
      where: {
        startTime: {
          gte: today,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    })
  }
}
