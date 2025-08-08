import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

// Generic get function for tips
const createTipGetProcedure = (tableName: string) =>
  authenticatedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await (ctx.db as any)[tableName].findUnique({
        where: {
          id: input,
          userId: ctx.user.id
        },
      });
    });

export const getRouter = createTRPCRouter({
  link: createTipGetProcedure("links"),
  category: createTipGetProcedure("categories"),
  user: authenticatedProcedure
    .query(async ({ ctx }) => {
      const userId = parseInt(ctx.user.id);
      const user = await ctx.db.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          profile: true,
          cover: true,
        },
      });

      // Get link and category counts for this user
      const [linkCount, categoryCount] = await Promise.all([
        ctx.db.links.count({ where: { userId } }),
        ctx.db.categories.count({ where: { userId } }),
      ]);

      return {
        ...user,
        linkCount,
        categoryCount,
      };
    })
});
