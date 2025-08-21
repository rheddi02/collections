import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

// Generic get function for tips
const getProcedure = (tableName: string) =>
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
  link: getProcedure("links"),
  category: getProcedure("categories"),
  categoryByName: authenticatedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.db.categories.findFirst({
      where: {
        title: input,
        userId: parseInt(ctx.user.id),
      },
    });
  }),
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
          password: true,
        },
      });

      // Get link and category counts for this user
      const [linkCount, categoryCount] = await Promise.all([
        ctx.db.links.count({ where: { userId } }),
        ctx.db.categories.count({ where: { userId } }),
      ]);

      return {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        profile: user?.profile,
        cover: user?.cover,
        hasPassword: Boolean(user?.password),
        linkCount,
        categoryCount,
      };
    })
});
