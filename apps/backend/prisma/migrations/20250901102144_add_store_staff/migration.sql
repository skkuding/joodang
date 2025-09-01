/*
  Warnings:

  - You are about to drop the column `store_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `owner_id` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('OWNER', 'STAFF');

-- DropForeignKey
ALTER TABLE "public"."user" DROP CONSTRAINT "user_store_id_fkey";

-- DropIndex
DROP INDEX "public"."store_organizer_key";

-- AlterTable
ALTER TABLE "public"."store" ADD COLUMN     "owner_id" INTEGER NOT NULL,
ALTER COLUMN "organizer" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "store_id";

-- CreateTable
CREATE TABLE "public"."store_staff" (
    "id" SERIAL NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'STAFF',
    "userId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "store_staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_staff_userId_storeId_key" ON "public"."store_staff"("userId", "storeId");

-- AddForeignKey
ALTER TABLE "public"."store" ADD CONSTRAINT "store_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."store_staff" ADD CONSTRAINT "store_staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."store_staff" ADD CONSTRAINT "store_staff_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
