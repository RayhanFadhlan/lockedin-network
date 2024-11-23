import { createRoute } from "@hono/zod-openapi";
import {
  GetProfileResponseSchema,
  UpdateProfileSchema,
} from "../schemas/profile.schema.js";

import { ErrorSchema } from "../schemas/error.schema.js";
import { createHono } from "../lib/HonoWrapper.js";
import { bearerAuth } from "hono/bearer-auth";
import { getProfile } from "../services/profile.service.js";

const profileRouter = createHono();

const getProfileRoute = createRoute({
  method: "get",
  path: "/profile/{user_id}",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetProfileResponseSchema,
        },
      },
      description: "Profile fetched successfully",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Profile fetch failed",
    },
  },
});

const updateProfileRoute = createRoute({
  method: "put",
  path: "/profile/{user_id}",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UpdateProfileSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: GetProfileResponseSchema,
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

profileRouter.openapi(getProfileRoute, async (c) => {
  const userId = c.req.param("user_id");
  
  const authHeader = c.req.header("Authorization");

  const response = await getProfile(userId, authHeader);

  return c.json({
    success: response.success,
    message: "Profile fetched successfully",
    body: response.body,
  }, 200)

 
});



export default profileRouter;