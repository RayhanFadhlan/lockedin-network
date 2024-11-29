import { createRoute } from "@hono/zod-openapi";
import {
  ContentRequestSchema,
  GetFeedQuerySchema,
  GetFeedResponseSchema,
  PostIdParamsSchema,
  PostSchema
} from "../schemas/feed.schema.js";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";

import { createHono } from "../lib/HonoWrapper.js";
import { getProfile, updateProfile } from "../services/profile.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import { getCookie } from "hono/cookie";
import { getConnectedFeeds, updateFeeds } from "../repositories/feed.repository.js";
import { createFeed, deleteFeed, getFeeds, updateFeed } from "../services/feed.service.js";

const feedRouter = createHono();


const getFeedRoute = createRoute({
  method: "get",
  path: "/feed",
  middleware: [authMiddleware] as const,
  request: {
    query: GetFeedQuerySchema
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
  const { cursor, limit } = c.req.valid('query');
  const payload =  c.get('jwtPayload');
  const tokenUserId = payload.userId as string;
  const response = await getFeeds(tokenUserId);

  return c.json(
    response, 
    200
  );
});

const createFeedRoute = createRoute({
  method: "post",
  path: "/feed/{post_id}",
  middleware: [authMiddleware] as const,
  request: {
    params : PostIdParamsSchema,
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
  const { post_id } = c.req.valid('param');
  const { content } = c.req.valid('json');

  const response = await createFeed(
      post_id,
      content
  );

  return c.json(
    response,
    200
  );
});

const updateFeedRoute = createRoute({
  method: "put",
  path: "/feed/{post_id}",
  middleware: [authMiddleware] as const,
  request: {
    params : PostIdParamsSchema,
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
  const { post_id } = c.req.valid('param');
  const { content } = c.req.valid('json');

  const response = await updateFeed(
      post_id,
      content
  );

  return c.json(
    response,
    200
  );
});

const deleteFeedRoute = createRoute({
  method: "delete",
  path: "/feed/{post_id}",
  middleware: [authMiddleware] as const,
  request: {
    params : PostIdParamsSchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: 'Feed deleted successfully.',
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: 'Feed delete failed.',
    },
  },
});

feedRouter.openapi(deleteFeedRoute, async (c) => {
  const { post_id } = c.req.valid('param');

  const response = await deleteFeed(
      post_id
  );

  return c.json(
    response,
    200
  );
});

export default feedRouter;
