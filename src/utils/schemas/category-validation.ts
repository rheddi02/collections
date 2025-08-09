import { z } from "zod"

// Basic category validation schema (for client-side validation)
export const categoryTitleSchema = z
  .string()
  .min(1, "Category name is required")
  .max(40, "Category name must be less than 50 characters")
  .regex(
    /^[a-zA-Z0-9.\s-]+$/,
    "Category name can only contain letters, numbers, spaces, hyphens (-), and periods (.)",
  )

// Enhanced schema with async uniqueness validation
// Note: This requires an API call and should be used carefully
export const categoryTitleSchemaWithUniqueness = (
  checkUniqueness: (title: string, excludeId?: number) => Promise<boolean>
) => categoryTitleSchema.refine(
  async (title) => {
    try {
      return await checkUniqueness(title);
    } catch {
      // If API call fails, skip validation to avoid blocking form
      return true;
    }
  },
  {
    message: "A category with this name already exists",
  }
);

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
