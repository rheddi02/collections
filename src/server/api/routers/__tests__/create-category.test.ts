import { describe, it, expect } from '@jest/globals'

describe('Category Creation API Integration', () => {
  describe('Schema Validation', () => {
    it('should validate category data correctly', async () => {
      const { categoryFormSchema } = await import('~/utils/schemas/category-validation')
      
      const validInput = {
        title: 'test-category',
      }

      const result = categoryFormSchema.safeParse(validInput)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('test-category')
      }
    })

    it('should reject invalid category data', async () => {
      const { categoryFormSchema } = await import('~/utils/schemas/category-validation')
      
      const invalidInputs = [
        { title: '' }, // Empty title
        { title: 'a'.repeat(41) }, // Too long
        { title: 'invalid@category' }, // Invalid characters
        { title: 'invalid#category' }, // Invalid characters
        { title: 'invalid$category' }, // Invalid characters
      ]

      invalidInputs.forEach(input => {
        const result = categoryFormSchema.safeParse(input)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('Category Validation Edge Cases', () => {
    it('should handle boundary values correctly', async () => {
      const { categoryFormSchema } = await import('~/utils/schemas/category-validation')
      
      // Test minimum length (1 character)
      const minResult = categoryFormSchema.safeParse({ title: 'a' })
      expect(minResult.success).toBe(true)

      // Test maximum length (40 characters)
      const maxResult = categoryFormSchema.safeParse({ title: 'a'.repeat(40) })
      expect(maxResult.success).toBe(true)

      // Test over maximum length (41 characters)
      const overMaxResult = categoryFormSchema.safeParse({ title: 'a'.repeat(41) })
      expect(overMaxResult.success).toBe(false)
    })

    it('should handle special allowed characters', async () => {
      const { categoryFormSchema } = await import('~/utils/schemas/category-validation')
      
      const validTitles = [
        'category-with-hyphens',
        'category.with.dots',
        'Category123',
        'Category 123',
        'category-123.test',
        'a',
        'A',
        '1',
        'a-b.c123',
      ]

      validTitles.forEach(title => {
        const result = categoryFormSchema.safeParse({ title })
        expect(result.success).toBe(true)
      })
    })

    it('should reject all invalid special characters', async () => {
      const { categoryFormSchema } = await import('~/utils/schemas/category-validation')
      
      const invalidChars = [
        '@', '#', '$', '%', '^', '&', '*', '(', ')',
        '+', '=', '[', ']', '{', '}', '|', '\\', ':', ';',
        '"', "'", '<', '>', ',', '?', '/', '!', '~', '`',
        '_', // underscore should also be invalid
      ]

      invalidChars.forEach(char => {
        const title = `category${char}test`
        const result = categoryFormSchema.safeParse({ title })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0]?.message).toBe(
            'Category name can only contain letters, numbers, spaces, hyphens (-), and periods (.)'
          )
        }
      })
    })

    it('should handle unicode characters', async () => {
      const { categoryFormSchema } = await import('~/utils/schemas/category-validation')
      
      const unicodeTitles = [
        'café', // accented characters
        'naïve', // diaeresis
        'résumé', // acute accent
        '測試', // Chinese characters
        'тест', // Cyrillic
        '🎉', // emoji
      ]

      unicodeTitles.forEach(title => {
        const result = categoryFormSchema.safeParse({ title })
        // These should fail based on the regex pattern
        expect(result.success).toBe(false)
      })
    })
  })
})
