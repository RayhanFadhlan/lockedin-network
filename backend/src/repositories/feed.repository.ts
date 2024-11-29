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

export const getConnectedFeeds = async (userId : string) => {
  const id = parseInt(userId);
  const feeds = await prisma.feed.findMany({
    where: {
      OR: [
        { user_id: id },

        {
          user: {
            sent_connections: {
              some: {
                to_id: id,
              },
            },
          },
        },
      ],
    },
    orderBy: {
      created_at: 'desc',
    },
  });
  return feeds.map(feed => ({
    ...feed,
    id: Number(feed.id),
    user_id: Number(feed.user_id)
  }));
}

export const postFeeds = async (userId : string, content : string) => {
  const id = parseInt(userId);
  const post = await prisma.feed.create({
    data : {
      updated_at: Date(),
      content: content,
      user_id: id
    }
  });
  return post;
}

export const updateFeeds = async (postId : string, content : string) => {
  const id = parseInt(postId);
  const post = await prisma.feed.update({
    where : { id: id },
    data : {
      updated_at: Date(),
      content: content,
    },
  });
  return post;
}

export const deleteFeeds = async (postId : string) => {
  const id = parseInt(postId);
  const post = await prisma.feed.delete({
    where : { id: id },
  });
  return post;
}