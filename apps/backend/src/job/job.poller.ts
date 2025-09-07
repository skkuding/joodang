import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { PrismaService } from '@prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

type Row = {
  topic: string
  key: string
  payload: any
}

@Injectable()
export class JobPoller {
  private readonly log = new Logger(JobPoller.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly emitter: EventEmitter2,
  ) {}

  // 3초마다 폴링
  @Interval(3000)
  async poll() {
    try {
      const rows = await this.lockDueJobs(100)
      for (const job of rows) {
        this.emitter.emit(job.topic, { key: job.key, ...job.payload })
      }
    } catch (e: any) {
      this.log.error(`poll error: ${e?.message}`)
    }
  }

  /**
   * due_at ≤ now 인 scheduled 작업을 잠그고 processing으로 전환하여 가져오기
   * - 동시성 안전 (FOR UPDATE SKIP LOCKED)
   * - 필요한 컬럼만 RETURNING
   */
  private async lockDueJobs(limit: number): Promise<Row[]> {
    const rows = await this.prisma.$queryRaw<Row[]>`
      WITH cte AS (
        SELECT id
        FROM public.notification_job
        WHERE status = 'scheduled' AND due_at <= NOW()
        ORDER BY due_at
        FOR UPDATE SKIP LOCKED
        LIMIT ${limit}
      )
      UPDATE public.notification_job AS j
      SET status = 'processing', updated_at = NOW()
      FROM cte
      WHERE j.id = cte.id
      RETURNING j.topic, j.payload, j.key;
    `
    return rows
  }
}
