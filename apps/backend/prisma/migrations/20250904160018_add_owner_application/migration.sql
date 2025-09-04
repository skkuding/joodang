-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Role" ADD VALUE 'ADMIN';
ALTER TYPE "public"."Role" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "public"."owner_application" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owner_application_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."owner_application" ADD CONSTRAINT "owner_application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
