import { prisma } from "../lib/prisma.js";

export const getChatHistory = async (userId1: string, userId2: string) => {
  const user1 = parseInt(userId1);
  const user2 = parseInt(userId2);

  const chatHistory = await prisma.chat.findMany({
    where: {
      OR: [
        { from_id: user1, to_id: user2 },
        { from_id: user2, to_id: user1 },
      ],
    },
    orderBy: {
      timestamp: 'asc',
    },
  });

  return chatHistory.map((message) => ({
    ...message,
    id: Number(message.id),
    from_id: Number(message.from_id),
    to_id: Number(message.to_id),
    timestamp: message.timestamp.toISOString(),
  }));
};

export const sendMessage = async (fromId: string, toId: string, message: string) => {
  const fromUser = parseInt(fromId);
  const toUser = parseInt(toId);

  const newMessage = await prisma.chat.create({
    data: {
      from_id: fromUser,
      to_id: toUser,
      message,
    },
  });

  return {
    ...newMessage,
    id: Number(newMessage.id),
    from_id: Number(newMessage.from_id),
    to_id: Number(newMessage.to_id),
    timestamp: newMessage.timestamp.toISOString(),
  };
};
