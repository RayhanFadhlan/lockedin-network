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

  const formattedHistory = chatHistory.map(msg => ({
    id: msg.id,
    from_id: msg.from_id,
    to_id: msg.to_id,
    message: msg.message,
    timestamp: msg.timestamp.toISOString()
  }));

  return formattedHistory;
};

export const sendMessage = async (fromId: string, toId: string, message: string) => {
  const fromUser = parseInt(fromId);
  const toUser = parseInt(toId);
  console.log(fromId, toId, message);

  const newMessage = await prisma.chat.create({
    data: {
      from_id: fromUser,
      to_id: toUser,
      message,
    },
  });

  return {
    ...newMessage,
    id: String(newMessage.id),
    from_id: String(newMessage.from_id),
    to_id: String(newMessage.to_id),
    timestamp: newMessage.timestamp.toISOString(),
  };
};

export const getAllConnections = async (userId: string) => {
    const user = parseInt(userId);
  
    return await prisma.connection.findMany({
      where: {
        OR: [
          { from_id: user },
          { to_id: user },
        ],
      },
      distinct: ['from_id', 'to_id'],
      include: {
        from_user: {
          select: {
            id: true,
            name: true,
            profile_photo: true,
          },
        },
        to_user: {
          select: {
            id: true,
            name: true,
            profile_photo: true,
          },
        },
      },
    });
  };
  

  export const getLastChatMessage = async (
    userId: string,
    otherUserId: string
  ) => {

    const user1 = parseInt(userId);
    const user2 = parseInt(otherUserId);

    return await prisma.chat.findFirst({
      where: {
        OR: [
          { from_id: user1, to_id: user2 },
          { from_id: user2, to_id: user1 },
        ],
      },
      orderBy: {
        timestamp: "desc",
      },
    });
  };