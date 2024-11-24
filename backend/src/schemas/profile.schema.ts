import { z } from '@hono/zod-openapi';
import { PostSchema } from './feed.schema.js';
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../lib/constant.js';

export const GetProfileResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    profile_photo: z.string().optional().nullable(),
    job_history: z.string().optional().nullable(),
    skills: z.string().optional().nullable(),
    relation: z.string(),
    relevant_posts: z.array(PostSchema).optional(),
  }),
});



export const UpdateProfileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255, 'Name must be less than 255 characters'),
  profile_photo: z.instanceof(File).or(z.string()).refine((file) => {
    if (file instanceof File) {
      return file.size <= MAX_IMAGE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type);
    }
    return true;
  }, {
    message: `Profile photo must be one of the following types: ${ACCEPTED_IMAGE_TYPES.join(', ')} and less than ${MAX_IMAGE_SIZE / 1000000}MB`,
  }).openapi({
    type: "string",
    format: "binary",
  }),
  work_history: z.string(),
  skills: z.string(),
});

export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;