import { z } from '@hono/zod-openapi';

export const UserSearchQuerySchema = z.object({
  search: z.string().optional().openapi({
    param: {
      name: 'search',
      in: 'query',
    },
    example: 'john'
  })
});
