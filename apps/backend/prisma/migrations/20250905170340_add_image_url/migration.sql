/*
  Warnings:

  - You are about to drop the column `photo_url` on the `menu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."menu" DROP COLUMN "photo_url",
ADD COLUMN     "image_url" TEXT;

-- AlterTable
ALTER TABLE "public"."store" ADD COLUMN     "image_url" TEXT NOT NULL DEFAULT 'https://joodang.com/store_image.png';
