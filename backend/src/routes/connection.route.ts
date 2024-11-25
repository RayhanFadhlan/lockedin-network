import { createRoute } from "@hono/zod-openapi";
import { createHono } from "../lib/HonoWrapper.js";
import { SuccessSchema, UserIdParamsSchema } from "../schemas/default.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCookie } from "hono/cookie";
import { getConnectionRequest, sendConnectionRequest } from "../services/connection.service.js";

export const connectionRouter = createHono();

const getConnectionRequestRoute = createRoute({
  method: "get",
  path: "/connection/request",
  middleware: [authMiddleware] as const,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Connection request data sent successfully",
    },
  },
});

connectionRouter.openapi(getConnectionRequestRoute, async (c) => {

  const payload = c.get('jwtPayload')
  const userId = payload.userId;

  const response = await getConnectionRequest(userId);

  return c.json(
    {
      success : true,
      message : "Connection request data sent successfully",
      body : response
    },
    200
  );
});

const sendConnectionRequestRoute = createRoute({
  method: "post",
  path: "/connection/send/{user_id}",
  request: {
    params: UserIdParamsSchema,
  },
  middleware: [authMiddleware] as const,
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Connection request sent successfully",
    },
  },
});

connectionRouter.openapi(sendConnectionRequestRoute, async (c) => {
  const { user_id } = c.req.valid('param');
  const payload = c.get('jwtPayload')
  const userId = payload.userId;
  const userTarget = user_id;

  const response = await sendConnectionRequest(userId, userTarget);

  return c.json(
    {
      success : true,
      message : "Connection request sent successfully",
      body : response
    },
    200
  );
});