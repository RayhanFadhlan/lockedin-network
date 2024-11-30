import { createRoute } from "@hono/zod-openapi";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";
import { UserSearchQuerySchema } from "../schemas/user.schema.js";
import { createHono } from "../lib/HonoWrapper.js";
import { searchUsers } from "../services/user.service.js";
import { getCookie } from "hono/cookie";

const userRouter = createHono();

const getUsersRoute = createRoute({
  method: "get",
  tags: ["User"],
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
  const token = await getCookie(c, 'token');
  const response = await searchUsers(token, search);

  return c.json({
    success: true,
    message: "Users fetched successfully",
    body: response
  }, 200);
});

export default userRouter;