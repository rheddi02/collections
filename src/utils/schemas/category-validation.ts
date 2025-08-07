import { z } from "zod"

// Category validation schemas
export const categoryTitleSchema = z
  .string()
  .min(1, "Category name is required")
  .max(40, "Category name must be less than 50 characters")
  .regex(
    /^[a-zA-Z0-9.-]+$/,
    "Category name can only contain letters, numbers, hyphens (-), and periods (.)",
  )

// Form schemas for different use cases
export const categoryFormSchema = z.object({
  title: categoryTitleSchema,
})

export const createCategorySchema = z.object({
  title: categoryTitleSchema,
})

export const updateCategorySchema = z.object({
  id: z.number().positive("Category ID is required"),
  title: categoryTitleSchema,
})

// Type exports for convenience
export type CategoryFormValues = z.infer<typeof categoryFormSchema>
export type CreateCategoryValues = z.infer<typeof createCategorySchema>
export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>
