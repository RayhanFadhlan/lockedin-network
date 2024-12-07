import { createRoute } from "@hono/zod-openapi";
import {
  GetProfileResponseSchema,
  UpdateProfileSchema,
} from "../schemas/profile.schema.js";

import { ErrorSchema, UserIdParamsSchema, SuccessSchema } from "../schemas/default.schema.js";
import { createHono } from "../lib/HonoWrapper.js";
import { getProfile, updateProfile } from "../services/profile.service.js";
import fs from "fs";
import path from "path";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import { getCookie } from "hono/cookie";
import { invalidateCache, profileCacheMiddleware } from "../middlewares/cache.middleware.js";

const profileRouter = createHono();

profileRouter.use(profileCacheMiddleware);

const getProfileRoute = createRoute({
  method: "get",
  tags: ["Profile"],
  path: "/profile/{user_id}",
  request: {
    params: UserIdParamsSchema
  },
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
  tags: ["Profile"],
  path: "/profile/{user_id}",
  middleware: [authMiddleware] as const,
  request: {
    params : UserIdParamsSchema,
    body: {
      content: {
        "multipart/form-data": {
          schema: UpdateProfileSchema,
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

profileRouter.openapi(getProfileRoute, async (c) => {

  const { user_id } = c.req.valid('param')

  // const authHeader = c.req.header("Authorization");
  const token = await getCookie(c, "token");

  const response = await getProfile(user_id, token);

  return c.json(
    {
      success: response.success,
      message: "Profile fetched successfully",
      body: response.body,
    },
    200
  );
});

profileRouter.openapi(updateProfileRoute, async (c) => {
  const { user_id } = c.req.valid('param')
  const payload =  c.get('jwtPayload');
  const tokenUserId = payload.userId as string;


  let {username, name, work_history, skills, profile_photo} = c.req.valid('form');

  name = name as string;

  work_history = work_history as string;
  skills = skills as string;
  

  if(profile_photo instanceof File){

    const response = await updateProfile(
      user_id,
      username,
      profile_photo,
      name,
      work_history,
      skills,
      tokenUserId,
    );
    
    return c.json(
      {
        success: response.success,
        message: "Profile updated successfully",
        body: response.body,
      },
      200
    );
  }

  else{
    throw new HttpError(HttpStatus.BAD_REQUEST, { message: "Profile photo must be a file" });
  }

});

export default profileRouter;
