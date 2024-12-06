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

  return !!connection;
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

  return connectionRequest.map(request => ({
    ...request,
    from_id: request.from_id,
    created_at: request.created_at.toISOString()
  }));
}

export const getConnectionCount = async (userId: string) => {
  const id = parseInt(userId);
  const connectionCount = await prisma.connection.count({
    where: {
      from_id: id
    }
  });

  return connectionCount;
}

export const getConnectedUser = async (userId: string) => {
  const id = parseInt(userId);
  const connections = await prisma.connection.findMany({
    where: {
      from_id: id
    },
    select: {
      to_id: true
    }
  });

  return connections.map(connection => connection.to_id);
}


export const getRelationStatus = async(userIdLoggedIn : string, userIdTarget : string) => {

  const id = parseInt(userIdLoggedIn);
  const target = parseInt(userIdTarget);

  const connection = await prisma.connection.findFirst({
    where: {
      OR: [
        {
          from_id: id,
          to_id: target
        },
        {
          to_id: target,
          from_id: id
        }
      ]
    }
  });

  if (connection) {
    return "connected";
  }

  if(id === target) {
    return "owner";
  }


  const connectionRequest = await prisma.connectionRequest.findFirst({
    where: {
      from_id: id,
      to_id: target
    }
  });

  if (connectionRequest) {
    return "request_sent";
  }
  const connectionRequest2 = await prisma.connectionRequest.findFirst({
    where: {
      from_id: target,
      to_id: id
    }
  });

  if (connectionRequest2) {
    return "request_received";
  }

  return "unconnected";
}

export const getRecommendedConnections = async (userId: string) => {
  const id = parseInt(userId);

  const firstLevelConnections = await prisma.connection.findMany({
    where: {
      OR: [
        { from_id: id },
        { to_id: id }
      ]
    },
    select: {
      from_id: true,
      to_id: true
    }
  });

  const firstLevel = new Set<number>();
  for (const user of firstLevelConnections) {
    firstLevel.add(Number(user.from_id));
    firstLevel.add(Number(user.to_id));
  }

  firstLevel.delete(id);

  const secondLevelConnections = await prisma.connection.findMany({
    where: {
      OR: [
        { from_id: { in: Array.from(firstLevel) } },
        { to_id: { in: Array.from(firstLevel) } }
      ]
    },
    select: {
      from_id: true,
      to_id: true
    }
  });

  const secondCandidates = new Set<number>();
  for (const user of secondLevelConnections) {
    secondCandidates.add(Number(user.from_id));
    secondCandidates.add(Number(user.to_id));
  }

  secondCandidates.delete(id);
  for (const user of firstLevel) {
    secondCandidates.delete(user);
  }

  const thirdLevelConnections = await prisma.connection.findMany({
    where: {
      OR: [
        { from_id: { in: Array.from(secondCandidates) } },
        { to_id: { in: Array.from(secondCandidates) } }
      ]
    },
    select: {
      from_id: true,
      to_id: true
    }
  });

  const thirdCandidates = new Set<number>();
  for (const user of thirdLevelConnections) {
    thirdCandidates.add(Number(user.from_id));
    thirdCandidates.add(Number(user.to_id));
  }

  thirdCandidates.delete(id);
  for (const user of firstLevel) {
    thirdCandidates.delete(user);
  }
  for (const user of secondCandidates) {
    thirdCandidates.delete(user);
  }

  const alreadyConnectedOrRequested = new Set<number>();

  const existingRequests = await prisma.connectionRequest.findMany({
    where: {
      OR: [
        { from_id: id },
        { to_id: id }
      ]
    },
    select: {
      from_id: true,
      to_id: true
    }
  });

  for (const user of existingRequests) {
    alreadyConnectedOrRequested.add(Number(user.from_id));
    alreadyConnectedOrRequested.add(Number(user.to_id));
  }

  const finalSecondDegree = Array.from(secondCandidates).filter(userid => !alreadyConnectedOrRequested.has(userid));
  const finalThirdDegree = Array.from(thirdCandidates).filter(userid => !alreadyConnectedOrRequested.has(userid));

  return {
    secondDegree: finalSecondDegree,
    thirdDegree: finalThirdDegree
  };
}
