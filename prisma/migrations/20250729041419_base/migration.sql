-- CreateEnum
CREATE TYPE "Type" AS ENUM ('NEW', 'OLD', 'SPECIAL');

-- CreateTable
CREATE TABLE "Videos" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coins" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Videos_id_idx" ON "Videos"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Coins_url_key" ON "Coins"("url");

-- CreateIndex
CREATE INDEX "Coins_id_idx" ON "Coins"("id");

-- CreateIndex
CREATE INDEX "Categories_id_idx" ON "Categories"("id");

-- AddForeignKey
ALTER TABLE "Coins" ADD CONSTRAINT "Coins_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
