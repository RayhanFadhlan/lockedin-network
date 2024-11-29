import { prisma } from "../lib/prisma.js";

export const createFeed = async (userId : string, content : string) => {

  const feed = await prisma.feed.create({
    data : {
      content,
      user_id : parseInt(userId)
    }
  });

  return feed;
}