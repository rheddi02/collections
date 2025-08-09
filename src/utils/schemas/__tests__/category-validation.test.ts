import { categoryFormSchema } from '~/utils/schemas/category-validation'

describe('Category Schema Validation', () => {
  describe('categoryFormSchema', () => {
    it('should validate a valid category title', () => {
      const validData = { title: 'valid-category' }
      const result = categoryFormSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('valid-category')
      }
    })

    it('should accept titles with letters, numbers, hyphens, and periods', () => {
      const validTitles = [
        'category123',
        'category-name',
        'category.name',
        'Category123',
        'cat-123.test',
      ]

      validTitles.forEach(title => {
        const result = categoryFormSchema.safeParse({ title })
        expect(result.success).toBe(true)
      })
    })

    it('should reject empty title', () => {
      const invalidData = { title: '' }
      const result = categoryFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Category name is required')
      }
    })

    it('should reject title that is too long', () => {
      const invalidData = { title: 'a'.repeat(41) } // 41 characters
      const result = categoryFormSchema.safeParse(invalidData)
      
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Category name must be less than 50 characters')
      }
    })

    it('should accept minimum valid length (1 character)', () => {
      const validData = { title: 'a' }
      const result = categoryFormSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })

    it('should accept maximum valid length (40 characters)', () => {
      const validData = { title: 'a'.repeat(40) }
      const result = categoryFormSchema.safeParse(validData)
      
      expect(result.success).toBe(true)
    })
  })
})
