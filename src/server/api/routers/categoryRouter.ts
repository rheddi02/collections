import { z } from "zod";
import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";
import { paginationSchema } from "~/utils/schemas";

export const categoryRouter = createTRPCRouter({
  create: authenticatedProcedure
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
          slug: input.title.toLowerCase().replace(/\s+/g, "-"), // Generate slug from title
          userId: userId,
        },
      });
    }),

  list: authenticatedProcedure
    .input(
      paginationSchema.extend({
        filters: z.object({
          keyword: z.string().optional(),
        }),
      }),
    )
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
                select: { links: true },
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
              categoryLinks: category._count.links,
            })),
          ),
        ctx.db.categories.count({
          where: {
            userId: parseInt(ctx.user.id), // Add user security check
            ...(filters.keyword && {
                title: {
                  contains: filters.keyword,
                  mode: "insensitive", // Case-insensitive search
                },
              }),
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

  listAll: authenticatedProcedure.query(async ({ ctx, input }) => {
    const categories = await ctx.db.categories.findMany({
      where: { userId: Number(ctx.user.id) },
      select: {
        id: true,
        title: true,
        slug: true,
        _count: {
          select: { links: true },
        },
      },
      orderBy: {
        title: "asc", // Sort categories alphabetically
      },
    });

    return categories.map((category) => ({
      ...category,
      categoryLinks: category._count.links,
    }));
  }),

  get: authenticatedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.categories.findUnique({
        where: { id: input, userId: parseInt(ctx.user.id) },
      });
    }),

  getByName: authenticatedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.categories.findFirst({
        where: {
          title: input,
          userId: parseInt(ctx.user.id),
        },
      });
    }),

  getBySlug: authenticatedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.categories.findFirst({
        where: {
          slug: input,
          userId: parseInt(ctx.user.id),
        },
      });
    }),

  update: authenticatedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        isPinned: z.boolean().default(false).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const userId = parseInt(ctx.user.id);

      // Check if category exists
      const existingCategory = await ctx.db.categories.findUnique({
        where: { id, userId: userId },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      // If title is being updated, check for uniqueness
      if (updateData.title && updateData.title !== existingCategory.title) {
        const duplicateCategory = await ctx.db.categories.findFirst({
          where: {
            title: {
              equals: updateData.title,
              mode: "insensitive", // Case-insensitive comparison
            },
            userId: userId,
            id: { not: id }, // Exclude the current category being updated
          },
        });

        if (duplicateCategory) {
          throw new Error("A category with this name already exists");
        }
      }

      return await ctx.db.categories.update({
        where: { id },
        data: {
          ...updateData,
          slug: updateData.title.toLowerCase().replace(/\s+/g, "-"), // Generate slug from title
        },
      });
    }),

  delete: authenticatedProcedure
    .input(z.array(z.number()))
    .mutation(async ({ ctx, input }) => {
      // SECURITY: Check if category exists AND belongs to authenticated user
      const existingCategories = await ctx.db.categories.findMany({
        where: { id: { in: input }, userId: parseInt(ctx.user.id) },
      });

      if (existingCategories.length === 0) {
        throw new Error("Category not found");
      }

      // CRITICAL SECURITY CHECK: Only allow users to delete their own data
      if (
        existingCategories.some(
          (category) => category.userId !== parseInt(ctx.user.id),
        )
      ) {
        throw new Error("Unauthorized: You can only delete your own category");
      }

      // First delete all links that belong to this category
      await ctx.db.links.deleteMany({
        where: {
          categoryId: { in: input },
          userId: parseInt(ctx.user.id), // Additional security check
        },
      });

      // Then delete the categories
      return await ctx.db.categories.deleteMany({
        where: { id: { in: input } },
      });
    }),
});
