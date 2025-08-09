import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

export const updateRouter = createTRPCRouter({
  category: authenticatedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        isPinned: z.boolean().default(false).optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = parseInt(ctx.user.id);
      
      // Check if category exists
      const existingCategory = await ctx.db.categories.findUnique({
        where: { id, userId: userId },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      // If title is being updated, check for uniqueness
      if (updateData.title && updateData.title !== existingCategory.title) {
        const duplicateCategory = await ctx.db.categories.findFirst({
          where: {
            title: {
              equals: updateData.title,
              mode: "insensitive", // Case-insensitive comparison
            },
            userId: userId,
            id: { not: id }, // Exclude the current category being updated
          },
        });

        if (duplicateCategory) {
          throw new Error("A category with this name already exists");
        }
      }

      return await ctx.db.categories.update({
        where: { id },
        data: {
          ...updateData,
          slug: updateData.title.toLowerCase().replace(/\s+/g, '-'), // Generate slug from title
        },
      });
    }),
  link: authenticatedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        categoryId: z.number()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Check if link exists
      const existingLink = await ctx.db.links.findUnique({
        where: { id },
      });

      if (!existingLink) {
        throw new Error("Link not found");
      }

      return await ctx.db.links.update({
        where: { id },
        data: {
          ...updateData,
          slug: updateData.title.toLowerCase().replace(/\s+/g, '-'), // Generate slug from title
          userId: parseInt(ctx.user.id) // Ensure userId is set
        },
      });
    }),
});