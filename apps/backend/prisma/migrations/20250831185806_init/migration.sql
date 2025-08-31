-- CreateEnum
CREATE TYPE "public"."MenuCategory" AS ENUM ('Tang', 'Tuiguim', 'Bap', 'Fruit', 'Maroon5', 'Beverage');

-- CreateTable
CREATE TABLE "public"."Store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "organizer" TEXT NOT NULL,
    "instagramId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "reservationFee" INTEGER NOT NULL,
    "college" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '디도 앞 잔디밭',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 37.2931959,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 126.9745929,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT,
    "price" INTEGER NOT NULL,
    "category" "public"."MenuCategory" NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "kakaoId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "studentId" TEXT,
    "college" TEXT,
    "major" TEXT,
    "profileImageUrl" TEXT,
    "storeId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TimeSlot" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "totalCapacity" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" SERIAL NOT NULL,
    "headcount" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "timeSlotId" INTEGER NOT NULL,
    "isDone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Store_organizer_key" ON "public"."Store"("organizer");

-- CreateIndex
CREATE INDEX "Menu_storeId_idx" ON "public"."Menu"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_kakaoId_key" ON "public"."User"("kakaoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentId_key" ON "public"."User"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_userId_timeSlotId_key" ON "public"."Reservation"("userId", "timeSlotId");

-- CreateIndex
CREATE INDEX "notification_record_user_id_create_time_id_idx" ON "public"."notification_record"("user_id", "create_time", "id");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscription_user_id_endpoint_key" ON "public"."push_subscription"("user_id", "endpoint");

-- CreateIndex
CREATE INDEX "_MenuToReservation_B_index" ON "public"."_MenuToReservation"("B");

-- AddForeignKey
ALTER TABLE "public"."Menu" ADD CONSTRAINT "Menu_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TimeSlot" ADD CONSTRAINT "TimeSlot_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "public"."Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reservation" ADD CONSTRAINT "Reservation_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES "public"."TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_record" ADD CONSTRAINT "notification_record_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "public"."notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notification_record" ADD CONSTRAINT "notification_record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."push_subscription" ADD CONSTRAINT "push_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToReservation" ADD CONSTRAINT "_MenuToReservation_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_MenuToReservation" ADD CONSTRAINT "_MenuToReservation_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
