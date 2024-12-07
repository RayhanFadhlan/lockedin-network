import { HttpError, HttpStatus } from "../lib/errors.js";
import { withCache } from "../lib/functionCache.js";
import { prisma } from "../lib/prisma.js";
import { getConnectedUser } from "./connection.repository.js";

export const getFeedsByUserId = withCache("feeds-user")(
  async (userId: string) => {
    const id = parseInt(userId);
    const feeds = await prisma.feed.findMany({
      where: {
        user_id: id,
      },
      take: 10,
      orderBy: {
        id: "desc",
      },
    });
    return feeds.map((feed) => ({
      ...feed,
      id: Number(feed.id),
      user_id: Number(feed.user_id),
    }));
  }
);

export const getConnectedFeeds = async (
  userId: string,
  cursorP?: string,
  limitP?: string
) => {
  const id = parseInt(userId);
  const limit = limitP ? parseInt(limitP) : 10;
  const cursor = cursorP ? parseInt(cursorP) : undefined;

  const connections = await prisma.connection.findMany({
    where: {
      from_id: id,
    },
    select: {
      to_id: true,
    },
  });

  const connectedUserIds = [
    id,
    ...connections.map((conn) => Number(conn.to_id)),
  ];

  const feeds = await prisma.feed.findMany({
    where: {
      user_id: {
        in: connectedUserIds as number[],
      },
      ...(cursor && {
        id: {
          lt: cursor,
        },
      }),
    },
    take: limit + 1,
    orderBy: {
      id: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          profile_photo: true,
        },
      },
    },
  });

  const hasMore = feeds.length > limit;
  const feedsToReturn = hasMore ? feeds.slice(0, -1) : feeds;

  return {
    feeds: feedsToReturn,
    cursor: hasMore ? feeds[feeds.length - 2].id : null,
  };
};

export const postFeeds = async (userId: string, content: string) => {
  const id = parseInt(userId);

  const post = await prisma.feed.create({
    data: {
      // updated_at: Date(),
      content: content,
      user_id: id,
    },
    include: {
      user: {
        select: {
          name: true,
          profile_photo: true,
        },
      },
    },
  });
  return post;
};

export const updateFeeds = async (
  postId: string,
  content: string,
  userId: string
) => {
  const id = parseInt(postId);
  const user = parseInt(userId);

  const isUserOwn = await prisma.feed.findFirst({
    where: {
      id: id,
      user_id: user,
    },
  });

  if (!isUserOwn) {
    throw new HttpError(HttpStatus.FORBIDDEN, {
      message: "You are not authorized to update this post",
    });
  }

  const post = await prisma.feed.update({
    where: { id: id },
    data: {
      updated_at: new Date(),
      content: content,
    },

    include: {
      user: {
        select: {
          name: true,
          profile_photo: true,
        },
      },
    },
  });
  return post;
};

export const deleteFeeds = async (postId: string) => {
  const id = parseInt(postId);
  const post = await prisma.feed.delete({
    where: { id: id },
  });
  return post;
};
