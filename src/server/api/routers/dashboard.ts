import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

export const profileCountRouter = createTRPCRouter({
  getCount: authenticatedProcedure.query(async ({ ctx }) => {
    const counts = await ctx.db.$transaction( async (db) => {
      const totalLinks = await db.links.count({
        where: {
          userId: parseInt(ctx.user.id)
        }
      });
      const totalCategory = await db.categories.count({
        where: {
          userId: parseInt(ctx.user.id)
        }
      });
      return {
        totalLinks,
        totalCategory
      };
    })
    return counts
  }),
});
