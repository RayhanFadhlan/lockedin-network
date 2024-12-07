import webpush from 'web-push';
import { createHono } from '../lib/HonoWrapper.js';
import { createRoute } from '@hono/zod-openapi';
import { subscribeRequestSchema } from '../schemas/notification.schema.js';
import { SuccessSchema } from '../schemas/default.schema.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { subscribeNotification } from '../services/notification.service.js';

const notificationRouter = createHono();

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY as string,
  privateKey: process.env.VAPID_PRIVATE_KEY as string,
};

webpush.setVapidDetails(
  "mailto:wbd@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const subscribeRoute = createRoute({
  tags: ["Notification"],
  method: "post",
  path: "/subscribe",
  middleware: [authMiddleware] as const,
  request: {
    body: {
      content: {
        "application/json" : {
          schema: subscribeRequestSchema
        }
      }
    }
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


notificationRouter.openapi(subscribeRoute, async (c) => {
  const { endpoint, keys } = c.req.valid("json");
  const payload = c.get('jwtPayload');
  const userId = payload.userId;
  const response = await subscribeNotification(userId, endpoint, keys);

  return c.json({
    success: true,
    message: "Notification subscribed successfully",
    body: response,
  }, 200);

});

export default notificationRouter;