/*
  Warnings:

  - Made the column `url` on table `Dining` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `General` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Roof` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dining" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Dining" ("createdAt", "description", "id", "title", "updatedAt", "url") SELECT "createdAt", "description", "id", "title", "updatedAt", "url" FROM "Dining";
DROP TABLE "Dining";
ALTER TABLE "new_Dining" RENAME TO "Dining";
CREATE INDEX "Dining_id_idx" ON "Dining"("id");
CREATE TABLE "new_General" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_General" ("createdAt", "description", "id", "title", "updatedAt", "url") SELECT "createdAt", "description", "id", "title", "updatedAt", "url" FROM "General";
DROP TABLE "General";
ALTER TABLE "new_General" RENAME TO "General";
CREATE INDEX "General_id_idx" ON "General"("id");
CREATE TABLE "new_Roof" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Roof" ("createdAt", "description", "id", "title", "updatedAt", "url") SELECT "createdAt", "description", "id", "title", "updatedAt", "url" FROM "Roof";
DROP TABLE "Roof";
ALTER TABLE "new_Roof" RENAME TO "Roof";
CREATE INDEX "Roof_id_idx" ON "Roof"("id");
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Room" ("createdAt", "description", "id", "title", "updatedAt", "url") SELECT "createdAt", "description", "id", "title", "updatedAt", "url" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE INDEX "Room_id_idx" ON "Room"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
