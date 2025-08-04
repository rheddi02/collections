/*
  Warnings:

  - A unique constraint covering the columns `[url,userId]` on the table `Links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Links_url_userId_key" ON "Links"("url", "userId");
