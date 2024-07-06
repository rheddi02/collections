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

-- CreateIndex
CREATE INDEX "BeautyTips_id_idx" ON "BeautyTips"("id");

-- CreateIndex
CREATE INDEX "EquipmentTips_id_idx" ON "EquipmentTips"("id");

-- CreateIndex
CREATE INDEX "HealthTips_id_idx" ON "HealthTips"("id");

-- CreateIndex
CREATE INDEX "HomeTips_id_idx" ON "HomeTips"("id");
