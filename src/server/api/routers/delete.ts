import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure, publicProcedure } from "~/server/api/trpc";

// Generic delete function for tips - NOW WITH OWNERSHIP SECURITY
const createTipDeleteProcedure = (tableName: string, entityName: string) =>
  authenticatedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      // SECURITY: Check if record exists AND belongs to authenticated user
      const existingRecord = await (ctx.db as any)[tableName].findUnique({
        where: { id: input, userId: parseInt(ctx.user.id) },
      });

      if (!existingRecord) {
        throw new Error(`${entityName} not found`);
      }

      // CRITICAL SECURITY CHECK: Only allow users to delete their own data
      if (existingRecord.userId !== parseInt(ctx.user.id)) {
        throw new Error(`Unauthorized: You can only delete your own ${entityName.toLowerCase()}`);
      }

      return await (ctx.db as any)[tableName].delete({
        where: { id: input },
      });
    });

export const deleteRouter = createTRPCRouter({
  link: createTipDeleteProcedure("links", "Link"),
  category: authenticatedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      // SECURITY: Check if category exists AND belongs to authenticated user
      const existingCategory = await ctx.db.categories.findUnique({
        where: { id: input, userId: parseInt(ctx.user.id) },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      // CRITICAL SECURITY CHECK: Only allow users to delete their own data
      if (existingCategory.userId !== parseInt(ctx.user.id)) {
        throw new Error("Unauthorized: You can only delete your own category");
      }

      // First delete all links that belong to this category
      await ctx.db.links.deleteMany({
        where: { 
          categoryId: input,
          userId: parseInt(ctx.user.id) // Additional security check
        },
      });

      // Then delete the category
      return await ctx.db.categories.delete({
        where: { id: input },
      });
    })
});
