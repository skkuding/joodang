-- DropForeignKey
ALTER TABLE "public"."reservation" DROP CONSTRAINT "reservation_store_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservation" DROP CONSTRAINT "reservation_time_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservation" DROP CONSTRAINT "reservation_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."reservation" ADD COLUMN     "phone" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
