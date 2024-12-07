import { withCache } from "../lib/functionCache.js";
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
      password_hash: hashedPassword,
      name: name,
      profile_photo: profilePhoto,
      work_history: workHistory,
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

export const findUserbyId = withCache('user') ( async (userId: string) => {
  const id = parseInt(userId);
  return prisma.user.findUnique({
    where: { id: id },
  });
}
);

export const updateUserDetail = async (
  userId: string,
  username: string,
  profilePhoto: string,
  name: string,
  workHistory: string,
  skills: string
) => {
  const id = parseInt(userId);
  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: {
      username: username,
      profile_photo: profilePhoto,
      name: name,
      work_history: workHistory,
      skills: skills,
      updated_at: new Date(),
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      profile_photo: true,
      work_history: true,
      skills: true,
    },
  });

  return {
    id: updatedUser.id.toString(),
    username: updatedUser.username,
    email: updatedUser.email,
    name: updatedUser.name,
    profile_photo: updatedUser.profile_photo,
    work_history: updatedUser.work_history,
    skills: updatedUser.skills,
  };
};

export const findUsers = async (searchQuery?: string) => {
  const users = await prisma.user.findMany({
    where: searchQuery
      ? {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        }
      : undefined,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      profile_photo: true,
    },
  });

  return users.map((user) => ({
    id: user.id.toString(),
    username: user.username,
    name: user.name,
    email: user.email,
    profile_photo: user.profile_photo,
  }));
};
