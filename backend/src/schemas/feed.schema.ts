import { z } from '@hono/zod-openapi';
import { create } from 'domain';

export const PostSchema = z.object({
  id : z.number(),
  content : z.string(),
  createdAt : z.string(),
  updatedAt : z.string(),
  userId : z.number(),
});

export type Post = z.infer<typeof PostSchema>;