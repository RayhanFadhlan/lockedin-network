import { z } from '@hono/zod-openapi';
import { PostSchema } from './feed.schema.js';

export const GetProfileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    profile_photo: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    job_history: z.string().optional(),
    skills: z.string().optional(),
    relation: z.string(),
    relevant_posts: z.array(PostSchema).optional(),
  }),
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255, 'Name must be less than 255 characters'),
  description: z.string().optional(),
  profile_photo: z.string().optional(),
});

export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;