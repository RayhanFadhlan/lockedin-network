import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  LoginSchema,
  RegisterResponseSchema,
  RegisterSchema,
} from "../schemas/auth.schema.js";
import { login, register } from "../services/auth.service.js";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";
import { createHono } from "../lib/HonoWrapper.js";

const authRouter = createHono();

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
  const { username, email, password, name } = await c.req.valid('json');
  const token = await register(username, email, password, name);
  c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

  return c.json(
    {
      success: true,
      message: "Registration successful",
      body: {
        token: token,
      },
    },
    200
  );
});


const loginRoute = createRoute({
  method: "post",
  path: "/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginSchema,
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
      description: "User logged in",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Login failed",
    },
  },
});

authRouter.openapi(loginRoute, async (c) => {
  const { identifier, password } = await c.req.valid('json');
  const token = await login(identifier, password);
  c.header("Set-Cookie", `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

  return c.json(
    {
      success: true,
      message: "Login successful",
      body: {
        token: token,
      },
    },
    200
  );
});


export default authRouter;
