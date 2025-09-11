/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `push_subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."push_subscription" ADD COLUMN     "token" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "push_subscription_token_key" ON "public"."push_subscription"("token");
