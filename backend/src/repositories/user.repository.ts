import { prisma } from "../lib/prisma.js";

export const createUser = async (
  username: string,
  email: string,
  name: string,
  hashedPassword: string,
  profilePhoto: string = "",
  workHistory: string = "",
  skills: string = ""
) => {
  return prisma.user.create({
    data: {
      username: username,
      email: email,
      passwordHash: hashedPassword,
      name: name,
      profilePhoto: profilePhoto,
      workHistory: workHistory,
      skills: skills,
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
  });
};

export const updateUserDetail = async (
  userId: string,
  name: string,
 
  profilePhoto: string,
  workHistory: string,
  skills: string
) => {
  const id = parseInt(userId);
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      name: name,
      profilePhoto: profilePhoto,
      workHistory: workHistory,
      skills: skills,
    },
  });

  return {
    ...updatedUser,
    id: updatedUser.id.toString(),
  };
};
