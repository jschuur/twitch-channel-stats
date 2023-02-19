import { PrismaClient } from '@prisma/client';
import { Channel } from '../lib/types.js';

const prisma = new PrismaClient();

export const getActiveChannels = () =>
  prisma.channel.findMany({
    where: { OR: [{ activeChat: true }, { activeEvents: true }] },
  }) as Promise<Channel[]>;
