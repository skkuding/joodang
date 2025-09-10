/*
  Warnings:

  - A unique constraint covering the columns `[redirect_code]` on the table `store` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."store" ADD COLUMN     "redirect_code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "store_redirect_code_key" ON "public"."store"("redirect_code");
