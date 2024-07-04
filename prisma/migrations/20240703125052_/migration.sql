/*
  Warnings:

  - Made the column `description` on table `HomeImprovements` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HomeImprovements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_HomeImprovements" ("createdAt", "description", "id", "title", "type", "updatedAt", "url") SELECT "createdAt", "description", "id", "title", "type", "updatedAt", "url" FROM "HomeImprovements";
DROP TABLE "HomeImprovements";
ALTER TABLE "new_HomeImprovements" RENAME TO "HomeImprovements";
CREATE INDEX "HomeImprovements_id_idx" ON "HomeImprovements"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
