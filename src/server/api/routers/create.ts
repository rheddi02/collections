import { z } from "zod";

import {
  createTRPCRouter,
  authenticatedProcedure,
} from "~/server/api/trpc";

// // Generic create function for tips - NOW WITH PROPER AUTH SECURITY
// const createTipCreateProcedure = (tableName: string) =>
//   authenticatedProcedure
//     .input(
//       z.object({
//         title: z.string().min(1),
//         description: z.string().default(""),
//         url: z.string(),
//         type: z.string(),
//         isPublic: z.boolean().default(true),
//       }),
//     )
//     .mutation(async ({ ctx, input }) => {
//       // SECURITY: Only authenticated users can create, data is linked to their user ID
//       return await (ctx.db as any)[tableName].create({
//         data: {
//           ...input,
//           userId: parseInt(ctx.user.id), // Use authenticated user's ID
//         },
//       });
//     });

export const createRouter = createTRPCRouter({
  category: authenticatedProcedure
    .input(
      z.object({
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.categories.create({
        data: {
          ...input,
          userId: parseInt(ctx.user.id), // Use authenticated user's ID
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
        isPinned: z.boolean().default(false).optional()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.links.create({
        data: { ...input, userId: parseInt(ctx.user.id) },
      });
    } catch (error) {
        if (error instanceof Error && error.message.toLowerCase().includes("unique constraint failed")) {
          throw new Error("Link with this URL already exists");
        }
        else throw new Error(error instanceof Error ? error.message : "Failed to create link");
      }
    }),
});
