import { prisma } from "../lib/prisma.js";

export const getFeedsByUserId = async (userId : string) => {
  const id = parseInt(userId);
  return prisma.feed.findMany({
    where: {
      user_id: id
    }
  });

}