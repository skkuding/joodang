import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as morgan from 'morgan'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  app.use(morgan.default('dev'))

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://joodang-frontend.vercel.app',
      'https://joodang.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
