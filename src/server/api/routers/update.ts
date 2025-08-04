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
      
      // Check if category exists
      const existingCategory = await ctx.db.categories.findUnique({
        where: { id, userId: parseInt(ctx.user.id) },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      return await ctx.db.categories.update({
        where: { id },
        data: updateData,
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
        data: updateData,
      });
    }),
});