import { z } from "@hono/zod-openapi";
import { createRoute } from "@hono/zod-openapi";
import { createHono } from "../lib/HonoWrapper.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";
import {
  getChatHistoryForUsers,
  getConnectionsWithLastMessage,
} from "../services/chat.service.js";

const chatRouter = createHono();

const getConnectionsWithLastMessageRoute = createRoute({
  method: "get",
  tags: ["Chat"],
  path: "/chat/connections",
  middleware: [authMiddleware] as const,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Connections with last messages fetched successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "No connections found for this user",
    },
  },
});

chatRouter.openapi(getConnectionsWithLastMessageRoute, async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.userId;

  const response = await getConnectionsWithLastMessage(userId);

  return c.json(
    {
      success: true,
      message: "Connections with last messages fetched successfully",
      loggedInUserId: userId,
      body: response,
    },
    200
  );
});

const getChatHistoryRoute = createRoute({
  method: "get",
  tags: ["Chat"],
  path: "/chat/history",
  middleware: [authMiddleware] as const,
  request: {
    query: z.object({ toId: z.string() }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Chat history fetched successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "No chat history found between these users",
    },
  },
});

chatRouter.openapi(getChatHistoryRoute, async (c) => {
  const payload = c.get("jwtPayload");
  const userId = payload.userId;
  const toId = c.req.query("toId") as string;
  const response = await getChatHistoryForUsers(userId, toId);

  return c.json(
    {
      success: true,
      message: "Chat history fetched successfully",
      loggedInUserId: userId,
      body: response,
    },
    200
  );
});

export default chatRouter;
