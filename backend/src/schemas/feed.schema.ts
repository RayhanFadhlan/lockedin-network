import { z } from '@hono/zod-openapi';
import { create } from 'domain';

export const PostSchema = z.object({
  id : z.number(),
  content : z.string(),
  created_at : z.string(),
  updated_at : z.string(),
  user_id : z.number(),
});

export type Post = z.infer<typeof PostSchema>;