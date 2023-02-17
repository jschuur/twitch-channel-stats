import { PrismaClient } from '@prisma/client';

import { ChatEvent } from '../lib/types';

const prisma = new PrismaClient();

export default function saveToDB(events: ChatEvent[]) {
  return prisma.chatMessage.createMany({ data: events });
}
