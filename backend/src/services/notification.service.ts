import { prisma } from "../lib/prisma.js"

export const subscribeNotification = async (userId : string,endpoint : string, keys : { p256dh : string, auth : string }) => {
  await prisma.pushSubscription.create({
    data : {
      user_id : parseInt(userId),
      endpoint : endpoint,
      keys : (keys)
    }
  })
  return "success";
}