import { prisma } from "../lib/prisma.js";
import type { RegisterRequest } from "../schemas/auth.schema.js";

export const createUser = async (
  username: string,
  email: string,
  hashedPassword: string
) => {
  return prisma.user.create({
    data: {
      username: username,
      email: email,
      passwordHash: hashedPassword,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email: email },
  });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username: username },
  });
};
