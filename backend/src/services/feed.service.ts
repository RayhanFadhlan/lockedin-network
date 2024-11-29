import { deleteFeeds, getConnectedFeeds, postFeeds, updateFeeds } from "../repositories/feed.repository.js";

export const getFeeds = async (userId: string) => {
  try {
    const feeds = getConnectedFeeds(userId);
    return {
      success: true,
      message: 'Feeds created successfully.',
      body: feeds
    }
  } catch (error) {
    return {
      success: false,
      message: 'Feeds create failed.',
      error: error
    }
  }
};

export const createFeed = async (postId: string, content: string) => {
  try {
    const postedFeeds = postFeeds(postId, content);
    return {
      success: true,
      message: 'Feeds created successfully.',
      body: postedFeeds
    }
  } catch (error) {
    return {
      success: false,
      message: 'Feeds create failed.',
      error: error
    }
  }
}

export const updateFeed = async (postId: string, content: string) => {
  try {
    const updatedFeeds = updateFeeds(postId, content);
    return {
      success: true,
      message: 'Feeds updated successfully.',
      body: updatedFeeds
    }
  } catch (error) {
    return {
      success: false,
      message: 'Feeds update failed.',
      error: error
    }
  }
}

export const deleteFeed = async (postId: string) => {
  try {
    const deletedFeeds = deleteFeeds(postId);
    return {
      success: true,
      message: 'Feeds deleted successfully.',
      body: deletedFeeds
    }
  } catch (error) {
    return {
      success: false,
      message: 'Feeds delete failed.',
      error: error
    }
  }

}