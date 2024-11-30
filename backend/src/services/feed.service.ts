import { HttpError, HttpStatus } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import {
  deleteFeeds,
  getConnectedFeeds,
  postFeeds,
  updateFeeds,
} from "../repositories/feed.repository.js";

export const getFeeds = async (
  userId: string,
  cursor?: string,
  limit?: string
) => {
  try {
    const feeds = await getConnectedFeeds(userId, cursor, limit);
    return {
      success: true,
      message: "Feeds fetched successfully.",
      body: feeds,
    };
  } catch (error) {
    return {
      success: false,
      message: "Feeds create failed.",
      error: error,
    };
  }
};

export const createFeed = async (userId: string, content: string) => {
  try {
    const postedFeeds = await postFeeds(userId, content);
    return {
      success: true,
      message: "Feeds created successfully.",
      body: postedFeeds,
    };
  } catch (error) {
    return {
      success: false,
      message: "Feeds create failed.",
      error: error,
    };
  }
};

export const updateFeed = async (
  postId: string,
  content: string,
  userId: string
) => {
  try {
    const updatedFeeds = await updateFeeds(postId, content, userId);
    return {
      success: true,
      message: "Feeds updated successfully.",
      body: updatedFeeds,
    };
  } catch (error) {
    return {
      success: false,
      message: "Feeds update failed.",
      error: error,
    };
  }
};

export const deleteFeed = async (postId: string, userId: string) => {
  try {
    const feed = await prisma.feed.findFirst({
      where: {
        id: parseInt(postId),
      },
    });
    if(!feed) {
      throw new HttpError(HttpStatus.NOT_FOUND, {
        message: "Feed not found",
      });
    }

    const isUserOwn = await prisma.feed.findFirst({
      where: {
        id: parseInt(postId),
        user_id: parseInt(userId),
      },
    });

    if (!isUserOwn) {
      throw new HttpError(HttpStatus.FORBIDDEN, {
        message: "You are not authorized to delete this post",
      });
    }

    const deletedFeeds = await deleteFeeds(postId);
    return {
      success: true,
      message: "Feeds deleted successfully.",
      body: deletedFeeds,
    };
  } catch (error) {
    return {
      success: false,
      message: "Feeds delete failed.",
      error: error,
    };
  }
};
