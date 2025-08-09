import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure, publicProcedure } from "~/server/api/trpc";

export const deleteRouter = createTRPCRouter({
  link: authenticatedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {

      return ctx.db.links.deleteMany({
        where: { 
          id: { in: input },
          userId: parseInt(ctx.user.id) // Additional security check
        },
      });
    }),
  category: authenticatedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      // SECURITY: Check if category exists AND belongs to authenticated user
      const existingCategories = await ctx.db.categories.findMany({
        where: { id: { in: input }, userId: parseInt(ctx.user.id) },
      });

      if (existingCategories.length === 0) {
        throw new Error("Category not found");
      }

      // CRITICAL SECURITY CHECK: Only allow users to delete their own data
      if (existingCategories.some(category => category.userId !== parseInt(ctx.user.id))) {
        throw new Error("Unauthorized: You can only delete your own category");
      }

      // First delete all links that belong to this category
      await ctx.db.links.deleteMany({
        where: { 
          categoryId: { in: input },
          userId: parseInt(ctx.user.id) // Additional security check
        },
      });

      // Then delete the categories
      return await ctx.db.categories.deleteMany({
        where: { id: { in: input } },
      });
    })
});
