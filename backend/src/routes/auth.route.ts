import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  LoginSchema,
  RegisterResponseSchema,
  RegisterSchema,
} from "../schemas/auth.schema.js";
import { login, register } from "../services/auth.service.js";
import { ErrorSchema, SuccessSchema } from "../schemas/default.schema.js";
import { createHono } from "../lib/HonoWrapper.js";
import { getCookie } from "hono/cookie";
import { jwt, verify } from "hono/jwt";
import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import webpush from "web-push";


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
  const { username, email, password, name } = await c.req.valid("json");
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
  const { identifier, password } = await c.req.valid("json");
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


const selfRoute = createRoute({
  method: "get",
  path: "/self",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SuccessSchema,
        },
      },
      description: "User information",
    },
  },
});

authRouter.openapi(selfRoute, async (c) => {
  const secret = process.env.JWT_SECRET as string;
  const token = await getCookie(c, "token");
  if (!token) {
    throw new HttpError(401, { message: "No token provided" });
  }
  const decoded = await verify(token, secret);

  const subscriptions = await prisma.pushSubscription.findMany();

  const notificationPayload = JSON.stringify({
    title: "New Feed",
    body: "content",
  });

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
     
       

        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              // @ts-ignore
              auth: subscription.keys.auth,
              // @ts-ignore
              p256dh: subscription.keys.p256dh,
            },
          },
          notificationPayload
        );
      } catch (error: unknown) {
        console.error("Failed to send notification:", error);
      }
    })
  );
  console.log("Successfully sent notification");

  return c.json(
    {
      success: true,
      message: "User information",
      body: decoded,
    },
    200
  );

});

export default authRouter;
