-- AlterTable
ALTER TABLE "public"."reservation" ALTER COLUMN "is_confirmed" DROP NOT NULL,
ALTER COLUMN "is_confirmed" DROP DEFAULT;
