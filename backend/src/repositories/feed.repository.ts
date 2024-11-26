import { prisma } from "../lib/prisma.js";

export const getFeedsByUserId = async (userId : string) => {
  const id = parseInt(userId);
  const feeds = await prisma.feed.findMany({
    where: {
      user_id: id
    }
  });
  return feeds.map(feed => ({
    ...feed,
    id: Number(feed.id),
    user_id: Number(feed.user_id)
  }));

}