/*
  Warnings:

  - Made the column `phone` on table `reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."reservation" ALTER COLUMN "phone" SET NOT NULL;
