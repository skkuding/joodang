/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."reservation" ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "reservation_token_key" ON "public"."reservation"("token");
