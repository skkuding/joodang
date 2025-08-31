import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

export type Paginator<T> = {
  skip?: number
  cursor?: T extends number ? { id: number } : T
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()

    // (옵션) 세션 레벨 타임아웃 등을 주고 싶다면 이렇게 설정 가능
    // await this.$executeRawUnsafe('SET statement_timeout = 5000');  // 5초
    // await this.$executeRawUnsafe('SET idle_in_transaction_session_timeout = 10000'); // 10초
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }

  // Use explicit type to avoid Prisma query argument type error
  getPaginator(cursor: number | null): Paginator<number>
  getPaginator<T>(
    cursor: number | null,
    transform: (arg: number) => T
  ): Paginator<T>

  getPaginator<T>(cursor: number | null, transform?: (arg: number) => T) {
    if (cursor == null) {
      return {}
    }
    if (transform) {
      return {
        skip: 1,
        cursor: transform(cursor),
      }
    }
    return {
      skip: 1,
      cursor: { id: cursor },
    }
  }
}