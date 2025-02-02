import { z } from '@hono/zod-openapi'

const usernameRegex = /^[^\s@]+$/;
export const RegisterSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(255, 'Username must be less than 255 characters')
    .regex(usernameRegex, 'Username cannot be an email')
    .openapi({
      example: 'johndoe'
    }),
  email: z.string()
    .email('Invalid email format')
    .openapi({
      example: 'john@example.com'
    }),
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(255, 'Name must be less than 255 characters')
    .openapi({
      example: 'John'
    }),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .openapi({
      example: 'password123'
    })
})

export const RegisterResponseSchema = z.object({
  success: z.boolean().openapi({
    example: true
  }),
  message: z.string().openapi({
    example: 'Registration successful'
  }),
  body: z.object({
    token: z.string().openapi({
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
    })
  })
})

export const LoginSchema = z.object({
  identifier: z.string().openapi({
    example: 'admin123'
    }),
  password: z.string().min(8).openapi({
    example: 'admin123'
    }),
});




export type RegisterRequest = z.infer<typeof RegisterSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>
export type LoginRequest = z.infer<typeof LoginSchema>
