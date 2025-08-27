import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

// Schema for pagination
const paginationInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).optional(),
});

// Generic list function for tips
export const listRouter = createTRPCRouter({
  link: authenticatedProcedure
    .input(
      paginationInput.extend({
        categoryTitle: z.string(),
        filters: z.object({
          keyword: z.string().optional(),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, perPage, categoryTitle, filters } = input;
      const skip = (page - 1) * (perPage || 10);

      // First find the category by title
      const category = await ctx.db.categories.findFirstOrThrow({
        where: {
          title: {
            equals: categoryTitle,
            mode: "insensitive", // Case-insensitive search
          },
          userId: parseInt(ctx.user.id), // Add user security check
        },
      });

      const [data, total] = await Promise.all([
        ctx.db.links.findMany({
          where: {
            categoryId: category.id,
            userId: parseInt(ctx.user.id), // Add user security check
            ...(filters.keyword && {
              title: {
                contains: filters.keyword,
                mode: "insensitive", // Case-insensitive search
              },
            }),
          },
          skip,
          take: perPage,
          orderBy: {
            id: "desc",
          },
        }),
        ctx.db.links.count({
          where: {
            categoryId: category.id,
            userId: parseInt(ctx.user.id), // Add user security check
          },
        }),
      ]);

      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / (perPage || 10)),
        category,
      };
    }),
  categories: authenticatedProcedure
    .input(paginationInput.extend({
      filters: z.object({
        keyword: z.string().optional(),
      }),
    }))
    .query(async ({ ctx, input }) => {
      const { page, perPage, filters } = input;
      const skip = (page - 1) * (perPage || 10);
      const [data, total] = await Promise.all([
        ctx.db.categories
          .findMany({
            where: {
              userId: parseInt(ctx.user.id), // Add user security check
              ...(filters.keyword && {
                title: {
                  contains: filters.keyword,
                  mode: "insensitive", // Case-insensitive search
                },
              }),
            },
            include: {
              _count: {
                select: { Links: true },
              },
            },
            skip,
            take: perPage,
            orderBy: {
              id: "desc",
            },
          })
          .then((categories) =>
            categories.map((category) => ({
              ...category,
              categoryLinks: category._count.Links,
            })),
          ),
        ctx.db.categories.count({
          where: {
            userId: parseInt(ctx.user.id), // Add user security check
          },
        }),
      ]);
      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / (perPage || 10)),
      };
    }),
  allCategories: authenticatedProcedure.query(async ({ ctx, input }) => {
    const categories = await ctx.db.categories.findMany({
      where: { userId: Number(ctx.user.id) },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: { Links: true },
        },
      },
      orderBy: {
        title: "asc", // Sort categories alphabetically
      },
    });

    return categories.map((category) => ({
      ...category,
      categoryLinks: category._count.Links,
    }));
  }),
});
