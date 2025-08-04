import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

export const countRouter = createTRPCRouter({
  links: authenticatedProcedure.query(async ({ ctx }) => {
    const userId = parseInt(ctx.user?.id || "0");
    
    // Get counts with category information
    const linkCounts = await ctx.db.links.groupBy({
      by: ["categoryId"],
      where: { userId },
      _count: {
        id: true,
      },
    });

    // Get category names for each categoryId
    const categoryIds = linkCounts.map((item) => item.categoryId);
    const categories = await ctx.db.categories.findMany({
      where: {
        id: { in: categoryIds }
      },
      select: {
        id: true,
        title: true,
      }
    });

    // Combine the data
    const result = linkCounts.map((linkCount) => {
      const category = categories.find((cat) => cat.id === linkCount.categoryId);
      return {
        categoryId: linkCount.categoryId,
        categoryName: category?.title || 'Unknown',
        count: linkCount._count.id,
      };
    });

    return result;
  }),
});
