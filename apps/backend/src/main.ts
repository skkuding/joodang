import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as morgan from 'morgan'
import cookieParser from 'cookie-parser'
import {
  S3Client,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
} from '@aws-sdk/client-s3'
import { ValidationPipe } from '@nestjs/common'

async function ensureBucketAndPolicy() {
  const bucket = process.env.S3_BUCKET!
  const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  })

  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
    console.log(`[MinIO] Bucket '${bucket}' exists`)
  } catch {
    await client.send(new CreateBucketCommand({ Bucket: bucket }))
    console.log(`[MinIO] Bucket '${bucket}' created`)
  }

  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AllowAnonymousReadToPublicPrefix',
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: ['arn:aws:s3:::joodang-assets/public/*'],
      },
    ],
  }

  await client.send(
    new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify(policy),
    }),
  )
  console.log(`[MinIO] Public read policy set on '${bucket}'`)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })

  await ensureBucketAndPolicy()

  app.use(morgan.default('dev'))
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true, 
      transform: true, 
    },
  ))

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5525',
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
