import { z } from '@hono/zod-openapi'

export const ErrorSchema = z.object({
  success: z.boolean().openapi({
    example: false
  }),
  message: z.string().openapi({
    example: 'An error occurred'
  }),
  error : z.string().openapi({
    example: 'Error message'
  })
})

export type ErrorResponse = z.infer<typeof ErrorSchema>