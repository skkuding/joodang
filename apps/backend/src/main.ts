import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://joodang-frontend.vercel.app',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type'], // ← JSON이면 이거 필요
  // credentials: true, // 쿠키 안 쓰면 빼도 OK
});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();