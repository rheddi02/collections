import { z } from "zod";
import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";
import { paginationSchema } from "~/utils/schemas";

export const linkRouter = createTRPCRouter({
  create: authenticatedProcedure
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
            slug: input.title.toLowerCase().replace(/\s+/g, "-"), // Generate slug from title
            userId: parseInt(ctx.user.id),
          },
        });
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.toLowerCase().includes("unique constraint failed")
        ) {
          throw new Error("Link with this URL already exists");
        } else
          throw new Error(
            error instanceof Error ? error.message : "Failed to create link",
          );
      }
    }),

  list: authenticatedProcedure
    .input(
      paginationSchema.extend({
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

  count: authenticatedProcedure.query(async ({ ctx }) => {
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

  get: authenticatedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db.links.findUnique({
        where: { id: input, userId: parseInt(ctx.user.id) },
      });
    }),

  update: authenticatedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        categoryId: z.number(),
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
        data: {
          ...updateData,
          slug: updateData.title.toLowerCase().replace(/\s+/g, "-"), // Generate slug from title
          userId: parseInt(ctx.user.id), // Ensure userId is set
        },
      });
    }),

  delete: authenticatedProcedure
  .input(z.array(z.number()))
  .mutation(async ({ ctx, input }) => {

    return ctx.db.links.deleteMany({
      where: { 
        id: { in: input },
        userId: parseInt(ctx.user.id) // Additional security check
      },
    });
  }),
});
