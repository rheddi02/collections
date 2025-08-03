import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

// Schema for pagination
const paginationInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100),
});


// Generic list function for tips
export const listRouter = createTRPCRouter({
  link: authenticatedProcedure
    .input(
      paginationInput.extend({
        categoryTitle: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, perPage, categoryTitle } = input;
      const skip = (page - 1) * (perPage || 10);

      // First find the category by title
      const category = await ctx.db.categories.findFirst({
        where: {
          title: {
            equals: categoryTitle,
            mode: 'insensitive', // Case-insensitive search
          },
        },
      });

      if (!category) {
        return {
          data: [],
          total: 0,
          page,
          perPage: perPage || 10,
          totalPages: 0,
        };
      }

      const [data, total] = await Promise.all([
        ctx.db.links.findMany({
          where: {
            categoryId: category.id,
          },
          skip,
          take: perPage,
          orderBy: {
            id: 'desc',
          },
          include: {
            category: true,
          },
        }),
        ctx.db.links.count({
          where: {
            categoryId: category.id,
          },
        }),
      ]);

      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        category: {
          id: category.id,
          title: category.title,
        },
      };
    }),

  coin: authenticatedProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const { page, perPage } = input;
      const skip = (page - 1) * (perPage||10);

      const [data, total] = await Promise.all([
        ctx.db.coins.findMany({
          skip,
          take: perPage,
          orderBy: {
            id: 'desc',
          },
          include: {
            categories: true,
          },
        }),
        ctx.db.coins.count(),
      ]);

      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / (perPage||10)),
      };
    }),
  categories: authenticatedProcedure
    .query(async ({ ctx }) => {

      const data = await ctx.db.categories.findMany({
        where: { userId: Number(ctx.user.id) },
        orderBy: {
          title: 'asc', // Sort categories alphabetically
        },
      });

      return data;
    }),
});
