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
          from_id: user1,
          to_id: user2
        },
        {
          to_id: user2,
          from_id: user1
        }
      ]
    }
  });

  return connection;
}

export const getMutualCount = async (userId: string, userTarget: string) => {
  const user = parseInt(userId);
  const userTargetId = parseInt(userTarget);


  const userTargetConnections = await prisma.connection.findMany({
    where: {
      from_id: userTargetId,
    },
    select: {
      to_id: true,
    },
  });

  const userTargetConnectionIds = userTargetConnections.map(connection => connection.to_id);

 
  const userConnections = await prisma.connection.findMany({
    where: {
      from_id: user,
    },
    select: {
      to_id: true,
    },
  });

  const userConnectionIds = userConnections.map(connection => connection.to_id);

  
  const mutualConnections = await prisma.connection.count({
    where: {
      from_id: user,
      to_id: {
        in: userTargetConnectionIds,
      },
    },
  });

  return mutualConnections;
};

export const getConnectionRequestDb = async (userId: string) => {
  const id = parseInt(userId);
  const connectionRequest = await prisma.connectionRequest.findMany({
    where: {
      to_id: id,
    },
    select: {
      from_id: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    }
  });

  return connectionRequest;
}
