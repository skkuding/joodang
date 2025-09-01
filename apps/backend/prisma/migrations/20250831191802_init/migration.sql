-- CreateEnum
CREATE TYPE "public"."menu_category" AS ENUM ('tang', 'tuiguim', 'bap', 'fruit', 'maroon5', 'beverage');

-- CreateTable
CREATE TABLE "public"."store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "organizer" TEXT NOT NULL,
    "instagram_id" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "reservation_fee" INTEGER NOT NULL,
    "college" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '디도 앞 잔디밭',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 37.2931959,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 126.9745929,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photo_url" TEXT,
    "price" INTEGER NOT NULL,
    "category" "public"."menu_category" NOT NULL,
    "store_id" INTEGER NOT NULL,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "kakao_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "student_id" TEXT,
    "college" TEXT,
    "major" TEXT,
    "profile_image_url" TEXT,
    "store_id" INTEGER,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."time_slot" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "total_capacity" INTEGER NOT NULL,
    "available_seats" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,

    CONSTRAINT "time_slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reservation" (
    "id" SERIAL NOT NULL,
    "headcount" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "time_slot_id" INTEGER NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT NOT NULL DEFAULT 'Other',
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notification_record" (
    "id" SERIAL NOT NULL,
    "notification_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."push_subscription" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "user_agent" TEXT,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "push_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_MenuToReservation" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MenuToReservation_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_organizer_key" ON "public"."store"("organizer");

-- CreateIndex
CREATE INDEX "menu_store_id_idx" ON "public"."menu"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_kakao_id_key" ON "public"."user"("kakao_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_student_id_key" ON "public"."user"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_user_id_time_slot_id_key" ON "public"."reservation"("user_id", "time_slot_id");

-- CreateIndex
CREATE INDEX "notification_record_user_id_create_time_id_idx" ON "public"."notification_record"("user_id", "create_time", "id");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscription_user_id_endpoint_key" ON "public"."push_subscription"("user_id", "endpoint");

-- CreateIndex
CREATE INDEX "_MenuToReservation_B_index" ON "public"."_MenuToReservation"("B");

-- AddForeignKey
ALTER TABLE "public"."menu" ADD CONSTRAINT "menu_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user" ADD CONSTRAINT "user_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_slot" ADD CONSTRAINT "time_slot_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reservation" ADD CONSTRAINT "reservation_time_slot_id_fkey" FOREIGN KEY ("time_slot_id") REFERENCES "public"."time_slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_record" ADD CONSTRAINT "notification_record_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_record" ADD CONSTRAINT "notification_record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."push_subscription" ADD CONSTRAINT "push_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToReservation" ADD CONSTRAINT "_MenuToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToReservation" ADD CONSTRAINT "_MenuToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
