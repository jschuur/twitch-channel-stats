/*
  Warnings:

  - You are about to drop the column `msg` on the `ChatMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "msg",
ADD COLUMN     "text" TEXT,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "context" DROP NOT NULL;
