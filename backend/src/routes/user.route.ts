import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";
import { UserSearchQuerySchema } from "../schemas/user.schema.js";
import { createHono } from "../lib/HonoWrapper.js";
import { searchUsers } from "../services/user.service.js";

const userRouter = createHono();

const getUsersRoute = createRoute({
  method: "get",
  path: "/users",
  request: {
    query: UserSearchQuerySchema
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema
        },
      },
      description: "Users fetched successfully",
    },
  },
});

userRouter.openapi(getUsersRoute, async (c) => {
  const { search } = c.req.valid('query');
  
  const users = await searchUsers(search);

  return c.json({
    success: true,
    message: "Users fetched successfully",
    body: users
  }, 200);
});

export default userRouter;