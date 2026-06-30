-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';

-- CreateIndex
CREATE INDEX "Categories_userId_idx" ON "Categories"("userId");

-- CreateIndex
CREATE INDEX "Categories_slug_idx" ON "Categories"("slug");

-- CreateIndex
CREATE INDEX "Links_userId_idx" ON "Links"("userId");

-- CreateIndex
CREATE INDEX "Links_categoryId_idx" ON "Links"("categoryId");
