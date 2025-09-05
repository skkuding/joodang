/*
  Warnings:

  - You are about to drop the column `instagram_id` on the `store` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `store` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."store" DROP COLUMN "instagram_id",
DROP COLUMN "phone",
ADD COLUMN     "contact_info" TEXT,
ADD COLUMN     "icon" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "total_capacity" INTEGER NOT NULL DEFAULT 50,
ALTER COLUMN "college" SET DEFAULT '성균관대학교';
