-- CreateTable
CREATE TABLE "notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT NOT NULL DEFAULT 'Other',
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "notification_record" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notification_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notification_record_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notification" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "notification_record_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "push_subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "user_agent" TEXT,
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_time" DATETIME NOT NULL,
    CONSTRAINT "push_subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Menu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT,
    "price" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    CONSTRAINT "Menu_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Menu" ("id", "name", "photoUrl", "price", "storeId") SELECT "id", "name", "photoUrl", "price", "storeId" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
CREATE TABLE "new_TimeSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "totalCapacity" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    CONSTRAINT "TimeSlot_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TimeSlot" ("availableSeats", "endTime", "id", "startTime", "storeId", "totalCapacity") SELECT "availableSeats", "endTime", "id", "startTime", "storeId", "totalCapacity" FROM "TimeSlot";
DROP TABLE "TimeSlot";
ALTER TABLE "new_TimeSlot" RENAME TO "TimeSlot";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "notification_record_user_id_create_time_id_idx" ON "notification_record"("user_id", "create_time", "id");

-- CreateIndex
CREATE UNIQUE INDEX "push_subscription_user_id_endpoint_key" ON "push_subscription"("user_id", "endpoint");
