/*
  Warnings:

  - Made the column `slug` on table `Categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Links` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Categories" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "Links" ALTER COLUMN "slug" SET NOT NULL;
