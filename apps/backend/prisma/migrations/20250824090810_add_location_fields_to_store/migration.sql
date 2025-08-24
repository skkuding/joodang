-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Store" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT,
    "organizer" TEXT NOT NULL,
    "instagramId" TEXT,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "reservationFee" INTEGER NOT NULL,
    "college" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '디도 앞 잔디밭',
    "latitude" REAL NOT NULL DEFAULT 37.2931959,
    "longitude" REAL NOT NULL DEFAULT 126.9745929
);
INSERT INTO "new_Store" ("college", "description", "endTime", "id", "instagramId", "isAvailable", "name", "organizer", "phone", "reservationFee", "startTime") SELECT "college", "description", "endTime", "id", "instagramId", "isAvailable", "name", "organizer", "phone", "reservationFee", "startTime" FROM "Store";
DROP TABLE "Store";
ALTER TABLE "new_Store" RENAME TO "Store";
CREATE UNIQUE INDEX "Store_organizer_key" ON "Store"("organizer");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
