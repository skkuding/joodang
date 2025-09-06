/*
  Warnings:

  - Added the required column `organizer` to the `owner_application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."owner_application" ADD COLUMN     "organizer" TEXT NOT NULL;
