import {
  getConnectionRequestDb,
  getMutualCount,
  getRecommendedConnections,
  getRelationStatus,
  isUserConnected,
} from "../repositories/connection.repository.js";

import { prisma } from "../lib/prisma.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import { verify } from "hono/jwt";

export const getConnectionRequest = async (userId: string) => {
  const id = parseInt(userId);
  const connectionRequests = await prisma.connectionRequest.findMany({
    where: {
      to_id: id,
    },
    select: {
      from_user: {
        select: {
          id: true,
          name: true,
          profile_photo: true,
        },
      },
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const formattedRequests = await Promise.all(
    connectionRequests.map(async (request) => ({
      id: String(request.from_user.id),
      name: request.from_user.name,
      profile_photo: request.from_user.profile_photo,
      created_at: request.created_at.toDateString(),
      mutual: await getMutualCount(userId, String(request.from_user.id)),
    }))
  );

  return formattedRequests;
};

export const sendConnectionRequest = async (
  userId: string,
  userTarget: string
) => {
  const id = parseInt(userId);
  const target = parseInt(userTarget);

  if (id === target) {
    throw new HttpError(HttpStatus.BAD_REQUEST, {
      message: "You cannot send a connection request to yourself",
    });
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: target },
  });

  if (!targetUser) {
    throw new HttpError(HttpStatus.NOT_FOUND, {
      message: "User not found",
    });
  }

  const existingRequest = await prisma.connectionRequest.findFirst({
    where: {
      from_id: id,
      to_id: target,
    }
  });

  if (existingRequest) {
    throw new HttpError(HttpStatus.CONFLICT, {
      message: "Connection request already exists",
    });
  }

  const existingConnection = await prisma.connection.findFirst({
    where: {
      from_id: id,
      to_id: target,
    }
  });

  if (existingConnection) {
    throw new HttpError(HttpStatus.CONFLICT, {
      message: "Connection already exists",
    });
  }

  const requestToConnection = await prisma.connectionRequest.findFirst({
    where: {
      from_id: target,
      to_id: id,
    },
  });

  if(requestToConnection) {
    return await acceptConnectionRequest(userTarget, userId);
  }


  const connectionRequest = await prisma.connectionRequest.create({
    data: {
      from_id: id,
      to_id: target,
      created_at: new Date(),
    },
  });

  return "Connection request sent successfully";
};

export const rejectConnectionRequest = async (
  userId: string,
  userTarget: string
) => {
  const id = parseInt(userId);
  const target = parseInt(userTarget);

  const connectionRequest = await prisma.connectionRequest.findFirst({
    where: {
      from_id: target,
      to_id: id,
    },
  });

  if (!connectionRequest) {
    throw new HttpError(HttpStatus.NOT_FOUND, {
      message: "Connection request not found",
    });
  }

  await prisma.connectionRequest.delete({
    where: {
      from_id_to_id: {
        from_id: target,
        to_id: id,
      },
    },
  });

  return "Connection request rejected successfully";
};

export const acceptConnectionRequest = async (
  userId: string,
  userTarget: string
) => {
  const id = parseInt(userId);
  const target = parseInt(userTarget);

  const connectionRequest = await prisma.connectionRequest.findFirst({
    where: {
      from_id: target,
      to_id: id,
    },
  });

  if (!connectionRequest) {
    throw new HttpError(HttpStatus.NOT_FOUND, {
      message: "Connection request not found",
    });
  }

  await prisma.connectionRequest.delete({
    where: {
      from_id_to_id: {
        from_id: target,
        to_id: id,
      },
    },
  });

  

  await prisma.connection.create({
    data: {
      from_id: target,
      to_id: id,
      created_at: new Date(),
    },
  });

  await prisma.connection.create({
    data: {
      from_id: id,
      to_id: target,
      created_at: new Date(),
    },
  });

  return "Connection request accepted successfully";
};

export const getConnection = async (
  userId: string,
  token: string | undefined
) => {
  const id = parseInt(userId);

  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new HttpError(HttpStatus.NOT_FOUND, {
      message: "User not found",
    });
  }

  const connections = await prisma.connection.findMany({
    where: { from_id: id },
    select: {
      to_id: true,
      to_user: {
        select: {
          name: true,
          profile_photo: true,
        },
      },
    },
  });

  if (token) {
    const payload = await verify(token, process.env.JWT_SECRET as string);
    const tokenUserId = payload.userId as string;
    const isMyself = id === parseInt(tokenUserId);

    const connectionsWithMutual = await Promise.all(
      connections.map(async (connection) => {
        const mutual = await getMutualCount(
          tokenUserId,
          String(connection.to_id)
        );
        const isConnected = await isUserConnected(
          tokenUserId,
          String(connection.to_id)
        );
        const relation = await getRelationStatus(tokenUserId, String(connection.to_id));

        return {
          id: String(connection.to_id),
          name: connection.to_user.name,
          profile_photo: connection.to_user.profile_photo,
          isConnected: isConnected,
          mutual: String(mutual),
          relation: relation,
        };
      })
    );
    return {
      connections: connectionsWithMutual,
      connectionCount: connections.length,
      isMySelf: isMyself,
    };
  } else {
    const connectionsWithDefaults = connections.map((connection) => ({
      id: String(connection.to_id),
      name: connection.to_user.name,
      profile_photo: connection.to_user.profile_photo,
      isConnected: false,
      mutual: "0",
    }));

    return {
      connections: connectionsWithDefaults,
      connectionCount: connections.length,
      isMySelf: false,
    };
  }
};

export const removeConnection = async (userId: string, userTarget: string) => {
  const id = parseInt(userId);
  const target = parseInt(userTarget);

  const connection = await prisma.connection.findFirst({
    where: {
      from_id: id,
      to_id: target,
    },
  });

  if (!connection) {
    throw new HttpError(HttpStatus.NOT_FOUND, {
      message: "Connection not found",
    });
  }

  await prisma.connection.delete({
    where: {
      from_id_to_id: {
        from_id: id,
        to_id: target,
      },
    },
  });

  await prisma.connection.delete({
    where: {
      from_id_to_id: {
        from_id: target,
        to_id: id,
      },
    },
  });

  await prisma.chat.deleteMany({
    where: {
      OR: [
        {
          from_id: id,
          to_id: target,
        },
        {
          from_id: target,
          to_id: id,
        },
      ],
    },
  })

  return "Connection removed successfully";
};


export const getAllRecommendations = async (userId: string) => {
    const connection = await getRecommendedConnections(userId);
    return connection;
}