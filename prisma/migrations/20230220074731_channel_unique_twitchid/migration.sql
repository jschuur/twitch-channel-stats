/*
  Warnings:

  - A unique constraint covering the columns `[twitchId]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - Made the column `twitchId` on table `Channel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "twitchId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Channel_twitchId_key" ON "Channel"("twitchId");
