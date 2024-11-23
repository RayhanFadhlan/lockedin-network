import { prisma } from "../lib/prisma.js";


export const isUserConnected = async (
  userId1: string,
  userId2: string
) => {
  const user1 = parseInt(userId1);
  const user2 = parseInt(userId2);
  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        {
          fromId: user1,
          toId: user2
        },
        {
          toId: user2,
          fromId: user1
        }
      ]
    }
  });

  return connection;
}