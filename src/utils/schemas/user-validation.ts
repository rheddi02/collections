import { z } from "zod"

// Reusable validation schemas
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")

export const emailSchema = z
  .string()
  .email("Please enter a valid email address")

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9._-]+$/, "Username can only contain letters, numbers, dots, hyphens, and underscores")
  .refine(val => !val.includes(' '), "Username cannot contain spaces")

export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(50, "Name must be less than 50 characters")

export const otpSchema = z
  .string()
  .length(6, "OTP must be exactly 6 digits")

// For form components that use "pin" instead of "otp"  
export const otpFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

// Common password confirmation refinement function
export const confirmPasswordRefinement = (
  passwordField: string = "password", 
  confirmField: string = "confirmPassword"
) => (data: Record<string, any>) => data[passwordField] === data[confirmField]

// Composite schemas for different use cases
export const registerFormSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(confirmPasswordRefinement("password", "confirmPassword"), {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// API-specific schema without confirmPassword
export const registerApiSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
})

export const profileFormSchema = z.object({
  name: nameSchema.optional(),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(confirmPasswordRefinement("newPassword", "confirmPassword"), {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const forgotPasswordEmailSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(confirmPasswordRefinement("newPassword", "confirmPassword"), {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Type exports for convenience
export type RegisterFormValues = z.infer<typeof registerFormSchema>
export type RegisterApiValues = z.infer<typeof registerApiSchema>
export type ProfileFormValues = z.infer<typeof profileFormSchema>
export type ForgotPasswordEmailValues = z.infer<typeof forgotPasswordEmailSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
export type OtpFormValues = z.infer<typeof otpFormSchema>
