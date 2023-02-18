import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default function saveToDB(events) {
    return prisma.chatMessage.createMany({ data: events });
}
