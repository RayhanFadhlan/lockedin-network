import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  RegisterResponseSchema,
  RegisterSchema,
} from "../schemas/auth.schema.js";
import { register } from "../services/auth.service.js";
import { ErrorSchema } from "../schemas/error.schema.js";
import { createHono } from "../lib/HonoWrapper.js";


const authRouter = createHono()

const registerRoute = createRoute({
  method: "post",
  path: "/register",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: RegisterResponseSchema,
        },
      },
      description: "User registered",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Registration failed",
    },
  },
});

authRouter.openapi(registerRoute, async (c) => {
    const { username, email, password } = await c.req.json();
    const response = await register(username, email, password);
    return c.json({
      success: true,
      message: "Registration successful",
      body: {
        token: response,
      },
    }, 200)
  
});

export default authRouter;
