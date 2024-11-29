import { z } from '@hono/zod-openapi';
import { create } from 'domain';

export const PostSchema = z.object({
  id : z.number(),
  content : z.string(),
  created_at : z.string(),
  updated_at : z.string(),
  user_id : z.number(),
});

export const ContentRequestSchema = z.object({
  content : z.string()
})

export const GetFeedResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z.object({
    feeds: z.array(PostSchema),
  }),
});

export const GetFeedQuerySchema = z.object({
  cursor: z.string().default('0').refine((val) => /^\d+$/.test(val), {
    message: "not a number",
  }).openapi({
    param: {
      name: 'cursor',
      in: 'query',
    },
    example: '10'
  }),
  limit: z.string().refine((val) => /^\d+$/.test(val), {
    message: "not a number",
  }).openapi({
    param: {
      name: 'limit',
      in: 'query',
    },
    example: '10'
  })
});

export const PostIdParamsSchema = z.object({
  post_id: z.string().refine((val) => /^\d+$/.test(val), {
    message: "not a number",
  }).openapi({
    param: {
      name: 'post_id',
    }
  }),
});

export type Post = z.infer<typeof PostSchema>;