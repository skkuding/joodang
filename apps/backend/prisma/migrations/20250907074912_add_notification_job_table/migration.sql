-- CreateEnum
CREATE TYPE "public"."JobStatus" AS ENUM ('scheduled', 'processing', 'done', 'failed');

-- CreateTable
CREATE TABLE "public"."notification_job" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "due_at" TIMESTAMP(3) NOT NULL,
    "status" "public"."JobStatus" NOT NULL DEFAULT 'scheduled',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_job_key_key" ON "public"."notification_job"("key");

CREATE INDEX idx_notification_jobs_due_scheduled
  ON public.notification_job (due_at)
  WHERE status = 'scheduled';