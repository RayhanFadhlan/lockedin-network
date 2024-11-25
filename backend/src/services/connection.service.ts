import { getConnectionRequestDb, getMutualCount } from "../repositories/connection.repository.js";

import { prisma } from "../lib/prisma.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import { verify } from "hono/jwt";

export const getConnectionRequest = async (userId: string) => {

  const id = parseInt(userId);
  const connectionRequests = await prisma.connectionRequest.findMany({
    where: {
      to_id: id
    },
    select: {
      from_user: {
        select: {
          id: true,
          name: true,
          profile_photo: true
        }
      },
      created_at: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  
  const formattedRequests = await Promise.all(
    connectionRequests.map(async (request) => ({
      id: String(request.from_user.id),
      name: request.from_user.name,
      profile_photo: request.from_user.profile_photo,
      created_at: request.created_at.toDateString(),
      mutual: await getMutualCount(userId, String(request.from_user.id))
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
    },
  });

  if (existingRequest) {
    throw new HttpError(HttpStatus.CONFLICT, {
      message: "Connection request already exists",
    });
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
  userTarget: string,
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
  userTarget: string,
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

export const getConnection = async (userId: string, token : string | undefined) => {
  const id = parseInt(userId);

  let isMyself;
  let mutualCount = 0;
  if(token){
    const payload = await verify(token, process.env.JWT_SECRET as string);
    const tokenUserId = payload.userId as string;
    isMyself = id === parseInt(tokenUserId);
    mutualCount = await getMutualCount(tokenUserId, userId);
  }else{
    isMyself = false;
  }

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
      created_at: true,
      to_user: {
        select: {
          id: true,
          name: true,
          profile_photo: true
        }
      }
    }
  });

  const connectionCount = connections.length;
  
  
  
  return {
    connections : connections.map(connection => {
      return {
        id: Number(connection.to_user.id),
        name: connection.to_user.name,
        profile_photo: connection.to_user.profile_photo,
        created_at: connection.created_at
      }
    }),
    connectionCount,
    mutualCount,
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

  return "Connection removed successfully";
};