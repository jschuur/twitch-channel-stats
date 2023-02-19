-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "channelname" TEXT NOT NULL,
    "activeChat" BOOLEAN NOT NULL DEFAULT true,
    "activeEvents" BOOLEAN NOT NULL DEFAULT true,
    "twitchId" TEXT,
    "displayName" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "description" TEXT,
    "broadcasterType" TEXT,
    "viewCount" INTEGER,
    "followers" INTEGER,
    "lastStreamedAt" TIMESTAMP(3),
    "config" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);
