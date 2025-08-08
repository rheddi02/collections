import { z } from "zod";

import {
  createTRPCRouter,
  authenticatedProcedure,
} from "~/server/api/trpc";

export const createRouter = createTRPCRouter({
  category: authenticatedProcedure
    .input(
      z.object({
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = parseInt(ctx.user.id);
      
      // Check if category with this title already exists for this user
      const existingCategory = await ctx.db.categories.findFirst({
        where: {
          title: {
            equals: input.title,
            mode: "insensitive", // Case-insensitive comparison
          },
          userId: userId,
        },
      });

      if (existingCategory) {
        throw new Error("A category with this name already exists");
      }

      return await ctx.db.categories.create({
        data: {
          ...input,
          slug: input.title.toLowerCase().replace(/\s+/g, '-'), // Generate slug from title
          userId: userId,
        },
      });
    }),
  link: authenticatedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.links.create({
        data: { 
          ...input, 
          slug: input.title.toLowerCase().replace(/\s+/g, '-'), // Generate slug from title
          userId: parseInt(ctx.user.id) },
      });
    } catch (error) {
        if (error instanceof Error && error.message.toLowerCase().includes("unique constraint failed")) {
          throw new Error("Link with this URL already exists");
        }
        else throw new Error(error instanceof Error ? error.message : "Failed to create link");
      }
    }),
});
