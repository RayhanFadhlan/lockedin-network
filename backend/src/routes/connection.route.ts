import { createRoute } from "@hono/zod-openapi";
import { createHono } from "../lib/HonoWrapper.js";
import { SuccessSchema, UserIdParamsSchema } from "../schemas/default.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCookie } from "hono/cookie";
import { acceptConnectionRequest, getAllRecommendations, getConnection, getConnectionRequest, rejectConnectionRequest, removeConnection, sendConnectionRequest } from "../services/connection.service.js";
import { invalidateCache } from "../middlewares/cache.middleware.js";

export const connectionRouter = createHono();


const getRecommendedConnectionsRoute = createRoute({
    method: "get",
    tags: ["Connection"],
    path: "/connection/recommended",
    middleware: [authMiddleware] as const,  
    responses: {
      200: {
        content: {
          "application/json": {
            schema: SuccessSchema,
          },
        },
        description: "Recommended connections data sent successfully",
      },
    },
    });

    connectionRouter.openapi(getRecommendedConnectionsRoute, async (c) => {
      const payload = c.get('jwtPayload')
      const userId = payload.userId;
      const response = await getAllRecommendations(userId);

      return c.json(
        {
          success : true,
          message : "Recommended connections data sent successfully",
          body : response
        },
        200
      );
    });
    
const getConnectionRequestRoute = createRoute({
  method: "get",
  tags: ["Connection"],
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
  tags: ["Connection"],
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
  invalidateCache(`profile:/profile/${userId}:*`);
  invalidateCache(`profile:/profile/${userTarget}:*`);
  return c.json(
    {
      success : true,
      message : "Connection request sent successfully",
      body : response
    },
    200
  );
});

const rejectConnectionRequestRoute = createRoute({
  method: "delete",
  tags: ["Connection"],
  path: "/connection/reject/{user_id}",
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
      description: "Connection request rejected successfully",
    },
  },
});

const acceptConnectionRequestRoute = createRoute({
  method: "post",
  tags: ["Connection"],
  path: "/connection/accept/{user_id}",
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
      description: "Connection request accepted successfully",
    },
  },
});

connectionRouter.openapi(rejectConnectionRequestRoute, async (c) => {
  const { user_id } = c.req.valid('param');
  const payload = c.get('jwtPayload')
  const userId = payload.userId;
  const userTarget = user_id;

  const response = await rejectConnectionRequest(userId, userTarget);
  invalidateCache(`profile:/profile/${userId}:*`);
  invalidateCache(`profile:/profile/${userTarget}:*`);
  return c.json(
    {
      success : true,
      message : "Connection request rejected successfully",
      body : response
    },
    200
  );
});

connectionRouter.openapi(acceptConnectionRequestRoute, async (c) => {
  const { user_id } = c.req.valid('param');
  const payload = c.get('jwtPayload')
  const userId = payload.userId;
  const userTarget = user_id;

  const response = await acceptConnectionRequest(userId, userTarget);

  invalidateCache(`profile:/profile/${userId}:*`);
  invalidateCache(`profile:/profile/${userTarget}:*`);
  return c.json(
    {
      success : true,
      message : "Connection request accepted successfully",
      body : response
    },
    200
  );
});

const getConnectionRoute = createRoute({
  method: "get",
  tags: ["Connection"],
  path: "/connection/{user_id}",
  request: {
    params: UserIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "Connection data sent successfully",
    },
  },
})

connectionRouter.openapi(getConnectionRoute, async (c) => {
  const { user_id } = c.req.valid('param');
  const userTarget = user_id;
  const token = getCookie(c, 'token');

  const response = await getConnection( userTarget, token);

  return c.json(
    {
      success : true,
      message : "Connection data sent successfully",
      body : response
    },
    200
  );
});

const unconnectRoute = createRoute({
  method: "delete",
  tags: ["Connection"],
  path: "/connection/{user_id}",
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
      description: "Connection deleted successfully",
    },
  },
});

connectionRouter.openapi(unconnectRoute, async (c) => {
  const { user_id } = c.req.valid('param');
  const payload = c.get('jwtPayload')
  const userId = payload.userId;
  const userTarget = user_id;

  const response = await removeConnection(userId, userTarget);
  invalidateCache(`profile:/profile/${userId}:*`);
  invalidateCache(`profile:/profile/${userTarget}:*`);
  return c.json(
    {
      success : true,
      message : "Connection removed successfully",
      body : response
    },
    200
  );
});