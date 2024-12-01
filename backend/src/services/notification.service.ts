import { request } from "http";
import { prisma } from "../lib/prisma.js";
import webpush from "web-push";

export const subscribeNotification = async (
  userId: string,
  endpoint: string,
  keys: { p256dh: string; auth: string }
) => {
  try {
    await prisma.pushSubscription.create({
      data: {
        user_id: parseInt(userId),
        endpoint: endpoint,
        keys: keys,
      },
    });
    return "success";
  } catch {
    return "no new subscription";
  }
};

export const notifyUser = async (
  userFrom: string,
  userTo: string,
  message: string
) => {
  const userToNotify = await prisma.pushSubscription.findMany({
    where: {
      user_id: parseInt(userTo),
    },
    include: {
      user: true,
    },
  });

  const userFromName = await prisma.user.findUniqueOrThrow({
    where: {
      id: parseInt(userFrom),
    },
    select: {
      name: true,
      profile_photo: true,
    },
  });

  const notificationPayload = JSON.stringify({
    body: {
      title: `New Message from ${userFromName.name}`,
      content: `${message}`,
      avatar: userFromName.profile_photo,
    },
  });

  await Promise.all(
    userToNotify.map(async (subscription) => {
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
      } catch (error: any) {
        console.error("Failed to send notification:", error);
      }
    })
  );
};

export const unsubscribeNotification = async (userId: string) => {
  await prisma.pushSubscription.deleteMany({
    where: {
      user_id: parseInt(userId),
    },
  });
};

export const notifyConnection = async (
  requesterId: string,
  content: string
) => {
  const requesterName = await prisma.user.findUniqueOrThrow({
    where: {
      id: parseInt(requesterId),
    },
    select: {
      name: true,
      profile_photo: true,
    },
  });

  const connectedUser = await prisma.connection.findMany({
    where: {
      from_id: parseInt(requesterId),
    },
    select: {
      to_id: true,
    },
  });

  const connectedUserIds = connectedUser.map((user) => user.to_id);

  const userToNotify = await prisma.pushSubscription.findMany({
    where: {
      user_id: {
        in: connectedUserIds,
      },
    },
  });

  const notificationPayload = JSON.stringify({
    body: {
      title: `New Post from ${requesterName.name}`,
      content: content,
      avatar: requesterName.profile_photo,
    },
  });

  await Promise.all(
    userToNotify.map(async (subscription) => {
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
      } catch (error: any) {
        console.error("Failed to send notification:", error);
      }
    })
  );
};
