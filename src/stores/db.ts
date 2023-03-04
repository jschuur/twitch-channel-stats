import { PrismaClient } from '@prisma/client';
import { HelixUser } from '@twurple/api';
import { Channel } from '../lib/types.js';

const prisma = new PrismaClient();

export const getChannels = () => prisma.channel.findMany() as Promise<Channel[]>;

export const getActiveChannels = () =>
  prisma.channel.findMany({
    where: { OR: [{ activeChat: true }, { activeEvents: true }] },
  }) as Promise<Channel[]>;

// TODO: add follower, views count
export const saveUpdatedChannels = (users: HelixUser[]) =>
  prisma.$transaction(
    users.map((user) =>
      prisma.channel.update({
        where: { twitchId: user.id },
        data: {
          channelname: user.name,
          displayName: user.displayName,
          description: user.description,
          broadcasterType: user.broadcasterType,
          profileImageUrl: user.profilePictureUrl,
          creationDate: user.creationDate,
          // viewCount: user.viewCount,
          // followers: user.followers,
        },
      })
    )
  );
