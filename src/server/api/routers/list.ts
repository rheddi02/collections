import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Generic list function for tips
const createTipListProcedure = (tableName: string) =>
  publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause = {
        OR: [
          { userId: ctx.user?.id }, // All data from logged-in user
          { isPublic: true }, // All public data from any user
        ],
      };

      const total = await (ctx.db as any)[tableName].count({
        where: whereClause,
      });

      if (input.page) {
        const data = await (ctx.db as any)[tableName].findMany({
          where: whereClause,
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await (ctx.db as any)[tableName].findMany({
          where: whereClause,
        });
        return { data, total };
      }
    });

export const listRouter = createTRPCRouter({
  beautyTip: createTipListProcedure("beautyTips"),
  equipmentTip: createTipListProcedure("equipmentTips"),
  foodTip: createTipListProcedure("foodTips"),
  healthTip: createTipListProcedure("healthTips"),
  homeTip: createTipListProcedure("homeTips"),
  petTip: createTipListProcedure("petTips"),
  clothTip: createTipListProcedure("clothTips"),
  plantTip: createTipListProcedure("plantTips"),
  rideTip: createTipListProcedure("rideTips"),
  leisureTip: createTipListProcedure("leisureTips"),
  energyTip: createTipListProcedure("energyTips"),
  video: createTipListProcedure("videos"),
  machineryTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
        filters: z.object({
          search: z.string(),
        }).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let whereClause: any = {
        OR: [
          { userId: ctx.user?.id }, // All data from logged-in user
          { isPublic: true }, // All public data from any user
        ],
      };

      // Add search filter if provided
      if (input?.filters?.search?.trim()) {
        whereClause = {
          AND: [
            {
              OR: [
                { userId: ctx.user?.id },
                { isPublic: true },
              ],
            },
            {
              description: {
                contains: input.filters.search,
              },
            },
          ],
        };
      }

      const total = await ctx.db.machineryTips.count({
        where: whereClause,
      });

      if (input.page) {
        const data = await ctx.db.machineryTips.findMany({
          where: whereClause,
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.machineryTips.findMany({
          where: whereClause,
        });
        return { data, total };
      }
    }),
  coin: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.coins.count();
      if (input.page) {
        const data = await ctx.db.coins.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.coins.findMany();
        return { data, total };
      }
    }),
  category: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.categories.count();
      if (input.page) {
        const data = await ctx.db.categories.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            title: "asc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.categories.findMany();
        return { data, total };
      }
    }),
});
