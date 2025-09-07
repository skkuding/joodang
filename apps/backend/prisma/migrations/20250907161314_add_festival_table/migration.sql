-- AlterTable
ALTER TABLE "public"."store" ADD COLUMN     "festival_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "public"."festival" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL DEFAULT '디도 앞 잔디밭',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 37.2931959,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 126.9745929,

    CONSTRAINT "festival_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."store" ADD CONSTRAINT "store_festival_id_fkey" FOREIGN KEY ("festival_id") REFERENCES "public"."festival"("id") ON DELETE CASCADE ON UPDATE CASCADE;
