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
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      profilePhoto: true,
      workHistory: true,
      skills: true,
    },
  });

  return {
    id: updatedUser.id.toString(),
    username: updatedUser.username,
    email: updatedUser.email,
    name: updatedUser.name,
    profile_photo: updatedUser.profilePhoto,
    work_history: updatedUser.workHistory,
    skills: updatedUser.skills,
  };
};

export const findUsers = async (searchQuery?: string) => {
  const users = await prisma.user.findMany({
    where: searchQuery
      ? {
          OR: [
            {
              username: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      profilePhoto: true,
    },
  });

  return users.map((user) => ({
    id: user.id.toString(),
    username: user.username,
    name: user.name,
    email: user.email,
    profile_photo: user.profilePhoto,
  }));
};
