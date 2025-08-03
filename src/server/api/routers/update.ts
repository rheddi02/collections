import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure, publicProcedure } from "~/server/api/trpc";

export const updateRouter = createTRPCRouter({
  coin: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        categoryId: z.number(),
        description: z.string().default(""),
        year: z.string(),
        type: z.enum(["NEW", "OLD", "SPECIAL"]),
        url: z.string(),
        isPublic: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Simplified: just check if coin exists (no ownership validation for demo)
      const existingCoin = await ctx.db.coins.findUnique({
        where: { id },
      });

      if (!existingCoin) {
        throw new Error("Coin not found");
      }

      return await ctx.db.coins.update({
        where: { id },
        data: updateData,
      });
    }),
  category: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Check if category exists
      const existingCategory = await ctx.db.categories.findUnique({
        where: { id },
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