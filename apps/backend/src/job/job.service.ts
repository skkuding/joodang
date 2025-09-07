import { Injectable } from '@nestjs/common'
import { JobStatus } from '@prisma/client'
import { PrismaService } from '@prisma/prisma.service'

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async markAsFailed(key: string) {
    await this.prisma.notificationJob.update({
      where: { key },
      data: { status: JobStatus.failed },
    })
  }

  async markAsDone(key: string) {
    await this.prisma.notificationJob.update({
      where: { key },
      data: { status: JobStatus.done },
    })
  }

  async deleteJobs(keys: string[]) {
    await this.prisma.notificationJob.deleteMany({
      where: {
        key: {
          in: keys,
        },
      },
    })
  }

  async createJob(key: string, fireAt: Date, payload: any, topic: string) {
    await this.prisma.notificationJob.create({
      data: { key, dueAt: fireAt, payload, topic },
    })
  }
}
