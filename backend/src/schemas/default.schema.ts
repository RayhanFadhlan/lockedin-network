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


export const SuccessSchema = z.object({
  success: z.boolean().openapi({
    example: true
  }),
  message: z.string().openapi({
    example: 'Success'
  }),
  body : z.object({
    
  })
})

export const UserIdParamsSchema = z.object({
  user_id: z.string().refine((val) => /^\d+$/.test(val), {
    message: "not a number",
  }).openapi({
    param: {
      name: 'user_id',
    }
  })
})



export type ErrorResponse = z.infer<typeof ErrorSchema>