-- AlterTable
ALTER TABLE "public"."notification" ADD COLUMN     "storeId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."notification" ADD CONSTRAINT "notification_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
