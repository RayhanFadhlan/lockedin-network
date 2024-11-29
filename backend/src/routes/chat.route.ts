import { createRoute } from "@hono/zod-openapi";
import { createHono } from "../lib/HonoWrapper.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";
import { getConnectionsWithLastMessage } from "../services/chat.service.js";

const chatRouter = createHono();

const getConnectionsWithLastMessageRoute = createRoute({
  method: "get",
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
    404: {
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
        body: response,
      },
      200
    );
  });

export default chatRouter;
