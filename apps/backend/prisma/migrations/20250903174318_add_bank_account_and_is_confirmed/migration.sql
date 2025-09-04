/*
  Warnings:

  - Added the required column `reservation_num` to the `reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_holder` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_number` to the `store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank_code` to the `store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."reservation" ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reservation_num" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."store" ADD COLUMN     "account_holder" TEXT NOT NULL,
ADD COLUMN     "account_number" TEXT NOT NULL,
ADD COLUMN     "bank_code" TEXT NOT NULL;
