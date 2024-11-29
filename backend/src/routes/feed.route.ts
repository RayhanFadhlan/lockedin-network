import { createRoute } from "@hono/zod-openapi";
import { createHono } from "../lib/HonoWrapper.js";
import { CreateFeedSchema } from "../schemas/feed.schema.js";
import { SuccessSchema } from "../schemas/default.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getCookie } from "hono/cookie";
import { createFeed } from "../services/feed.service.js";
import { prisma } from "../lib/prisma.js";
import webpush from "web-push";

const feedRouter = createHono();

interface SubscriptionKeys {
  p256dh: string;
  auth: string;
}

const creteFeedRoute = createRoute({
  method: "post",
  path: "/feed",
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateFeedSchema,
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
      description: "Feed created successfully",
    },
  },
});

feedRouter.openapi(creteFeedRoute, async (c) => {
  const { content } = c.req.valid("json");
  const payload = c.get("jwtPayload");
  const userId = payload.userId;
  const response = await createFeed(userId, content);

  const subscriptions = await prisma.pushSubscription.findMany();

  const notificationPayload = JSON.stringify({
    title: "New Feed",
    body: "content",
  });

  await Promise.all(
    subscriptions.map(async (subscription) => {
      try {
        
        const keys = JSON.parse(subscription.keys as string);

        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: keys.auth,
              p256dh: keys.p256dh,
            },
          },
          notificationPayload
        );
      } catch (error: unknown) {
        console.error("Failed to send notification:", error);
      }
    })
  );

  return c.json(
    {
      success: true,
      message: "Feed created successfully",
      body: response,
    },
    200
  );
});
