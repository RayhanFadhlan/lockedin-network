import { getConnectionRequestDb } from "../repositories/connection.repository.js";

import { prisma } from "../lib/prisma.js";
import { HttpError, HttpStatus } from "../lib/errors.js";

export const getConnectionRequest = async (userId: string) => {
  const connectionRequest = await getConnectionRequestDb(userId);

  return connectionRequest;
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
