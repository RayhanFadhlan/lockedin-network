import { createRoute } from "@hono/zod-openapi";

import {
  ContentRequestSchema,
  GetFeedQuerySchema,
  GetFeedResponseSchema,
  PostIdParamsSchema,
  PostSchema,
} from "../schemas/feed.schema.js";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";

import { createHono } from "../lib/HonoWrapper.js";
import { getProfile, updateProfile } from "../services/profile.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import { getCookie } from "hono/cookie";
import {
  getConnectedFeeds,
  updateFeeds,
} from "../repositories/feed.repository.js";
import {
  createFeed,
  deleteFeed,
  getFeeds,
  getMyFeed,
  updateFeed,
} from "../services/feed.service.js";
import { feedCacheMiddleware } from "../middlewares/cache.middleware.js";

const feedRouter = createHono();

// feedRouter.use(feedCacheMiddleware);

const getFeedRoute = createRoute({
  method: "get",
  tags: ["Feed"],
  path: "/feed",
  middleware: [authMiddleware] as const,
  request: {
    query: GetFeedQuerySchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Feeds fetched successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Feeds fetch failed",
    },
  },
});

feedRouter.openapi(getFeedRoute, async (c) => {
  const { cursor, limit } = c.req.valid("query");
  const payload = c.get("jwtPayload");
  const tokenUserId = payload.userId as string;
  const response = await getFeeds(tokenUserId, cursor, limit);

  return c.json(response, 200);
});

const createFeedRoute = createRoute({
  method: "post",
  tags: ["Feed"],
  path: "/feed",
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        "application/json": {
          schema: ContentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Profile updated successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Profile update failed",
    },
  },
});

feedRouter.openapi(createFeedRoute, async (c) => {
  const { content } = c.req.valid("json");
  const payload = c.get("jwtPayload");
  const userId = payload.userId;
  const response = await createFeed(userId, content);

  return c.json(response, 200);
});

const updateFeedRoute = createRoute({
  method: "put",
  tags: ["Feed"],
  path: "/feed/{post_id}",
  middleware: [authMiddleware] as const,
  request: {
    params: PostIdParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: ContentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Profile updated successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Profile update failed",
    },
  },
});

feedRouter.openapi(updateFeedRoute, async (c) => {
  const { post_id } = c.req.valid("param");
  const { content } = c.req.valid("json");

  const payload = c.get("jwtPayload");
  const userId = payload.userId;
  const response = await updateFeed(post_id, content, userId);

  return c.json(response, 200);
});

const deleteFeedRoute = createRoute({
  method: "delete",
  tags: ["Feed"],
  path: "/feed/{post_id}",
  middleware: [authMiddleware] as const,
  request: {
    params: PostIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Feed deleted successfully.",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Feed delete failed.",
    },
  },
});

feedRouter.openapi(deleteFeedRoute, async (c) => {
  const { post_id } = c.req.valid("param");
  const payload = c.get("jwtPayload");
  const userId = payload.userId;
  const response = await deleteFeed(post_id, userId);

  return c.json(response, 200);
});

const getMyFeedRoute = createRoute({
  method: "get",
  tags: ["Feed"],
  path: "/myfeed",
  middleware: [authMiddleware] as const,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Feeds fetched successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Feeds fetch failed",
    },
  },
});

feedRouter.openapi(getMyFeedRoute, async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.userId as string;
  const response = await getMyFeed(userId);

  return c.json(response, 200);
});

export default feedRouter;
