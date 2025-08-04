/*
  Warnings:

  - You are about to drop the `BeautyTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClothTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EnergyTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EquipmentTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FoodTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HealthTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HomeTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LeisureTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MachineryTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PetTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlantTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RideTips` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Videos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BeautyTips" DROP CONSTRAINT "BeautyTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "ClothTips" DROP CONSTRAINT "ClothTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "Coins" DROP CONSTRAINT "Coins_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Coins" DROP CONSTRAINT "Coins_userId_fkey";

-- DropForeignKey
ALTER TABLE "EnergyTips" DROP CONSTRAINT "EnergyTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "EquipmentTips" DROP CONSTRAINT "EquipmentTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "FoodTips" DROP CONSTRAINT "FoodTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "HealthTips" DROP CONSTRAINT "HealthTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "HomeTips" DROP CONSTRAINT "HomeTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "LeisureTips" DROP CONSTRAINT "LeisureTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "MachineryTips" DROP CONSTRAINT "MachineryTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "PetTips" DROP CONSTRAINT "PetTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlantTips" DROP CONSTRAINT "PlantTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "RideTips" DROP CONSTRAINT "RideTips_userId_fkey";

-- DropForeignKey
ALTER TABLE "Videos" DROP CONSTRAINT "Videos_userId_fkey";

-- DropTable
DROP TABLE "BeautyTips";

-- DropTable
DROP TABLE "ClothTips";

-- DropTable
DROP TABLE "Coins";

-- DropTable
DROP TABLE "EnergyTips";

-- DropTable
DROP TABLE "EquipmentTips";

-- DropTable
DROP TABLE "FoodTips";

-- DropTable
DROP TABLE "HealthTips";

-- DropTable
DROP TABLE "HomeTips";

-- DropTable
DROP TABLE "LeisureTips";

-- DropTable
DROP TABLE "MachineryTips";

-- DropTable
DROP TABLE "PetTips";

-- DropTable
DROP TABLE "PlantTips";

-- DropTable
DROP TABLE "RideTips";

-- DropTable
DROP TABLE "Videos";

-- DropEnum
DROP TYPE "Type";
