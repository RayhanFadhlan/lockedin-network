import { z } from '@hono/zod-openapi';


export const subscribeRequestSchema = z.object({
  endpoint : z.string(),
  keys : z.object({
    p256dh : z.string(),
    auth : z.string(),
  })
});