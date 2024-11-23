import { prisma } from "../lib/prisma.js";


export const createUser = async (
  username: string,
  email: string,
  name: string,
  hashedPassword: string
) => {
  return prisma.user.create({
    data: {
      username: username,
      email: email,
      passwordHash: hashedPassword,
      userDetail: {
        create: {
          name: name,
        },
      },
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

export const findUserbyId = async (userId: string) => {
  const id = parseInt(userId);
  return prisma.user.findUnique({
    where: { id: id },
    include: {
      userDetail: true,
    }
  });
}
