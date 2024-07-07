-- CreateTable
CREATE TABLE "BeautyTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BeautyTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EquipmentTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EquipmentTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PetTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClothTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClothTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineryTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MachineryTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RideTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RideTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeisureTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeisureTips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyTips" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyTips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BeautyTips_id_idx" ON "BeautyTips"("id");

-- CreateIndex
CREATE INDEX "EquipmentTips_id_idx" ON "EquipmentTips"("id");

-- CreateIndex
CREATE INDEX "HealthTips_id_idx" ON "HealthTips"("id");

-- CreateIndex
CREATE INDEX "HomeTips_id_idx" ON "HomeTips"("id");

-- CreateIndex
CREATE INDEX "FoodTips_id_idx" ON "FoodTips"("id");

-- CreateIndex
CREATE INDEX "PetTips_id_idx" ON "PetTips"("id");

-- CreateIndex
CREATE INDEX "ClothTips_id_idx" ON "ClothTips"("id");

-- CreateIndex
CREATE INDEX "PlantTips_id_idx" ON "PlantTips"("id");

-- CreateIndex
CREATE INDEX "MachineryTips_id_idx" ON "MachineryTips"("id");

-- CreateIndex
CREATE INDEX "RideTips_id_idx" ON "RideTips"("id");

-- CreateIndex
CREATE INDEX "LeisureTips_id_idx" ON "LeisureTips"("id");

-- CreateIndex
CREATE INDEX "EnergyTips_id_idx" ON "EnergyTips"("id");
