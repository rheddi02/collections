import { z } from "zod"

// Link validation schemas
export const urlSchema = z
  .string()
  .min(1, "URL is required")
  .url("Please enter a valid URL (e.g., https://example.com)")

export const titleSchema = z
  .string()
  .min(1, "Title is required")
  .min(2, "Title must be at least 3 characters")

export const descriptionSchema = z
  .string()
  .optional()

// Form schemas for different use cases
export const linkFormSchema = z.object({
  id: z.number().optional(),
  title: titleSchema,
  url: urlSchema,
  description: descriptionSchema,
})

export const createLinkSchema = z.object({
  title: titleSchema,
  url: urlSchema,
  description: descriptionSchema,
})

export const updateLinkSchema = z.object({
  id: z.number().positive("Link ID is required"),
  title: titleSchema,
  url: urlSchema,
  description: descriptionSchema,
})

// Type exports for convenience
export type LinkFormValues = z.infer<typeof linkFormSchema>
export type CreateLinkValues = z.infer<typeof createLinkSchema>
export type UpdateLinkValues = z.infer<typeof updateLinkSchema>
