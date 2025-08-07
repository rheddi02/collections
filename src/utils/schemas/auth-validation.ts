import { z } from "zod"
import { emailSchema, passwordSchema, usernameSchema } from "./user-validation"

// Auth-specific validation schemas
export const signInSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
})

// Additional auth schemas can be added here as needed
export const signInWithEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
})

export const signInWithUsernameSchema = z.object({
  username: usernameSchema,
  password: z.string().min(1, "Password is required"),
})

// Type exports for convenience
export type SignInFormValues = z.infer<typeof signInSchema>
export type SignInWithEmailValues = z.infer<typeof signInWithEmailSchema>
export type SignInWithUsernameValues = z.infer<typeof signInWithUsernameSchema>
