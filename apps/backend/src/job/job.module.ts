import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { PrismaService } from '@prisma/prisma.service'
import { JobPoller } from './job.poller'
import { JobService } from './job.service'

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [PrismaService, JobPoller, JobService],
  exports: [JobService],
})
export class JobModule {}
