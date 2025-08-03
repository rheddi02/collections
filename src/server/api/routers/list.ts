import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Schema for pagination
const paginationInput = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).optional(),
});

// Generic list function for tips
const createTipListProcedure = (tableName: string) =>
  publicProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const { page, perPage } = input;
      const skip = (page - 1) * (perPage || 10)
      
      if (!perPage) {
        const [data] = await Promise.all([
        (ctx.db as any)[tableName].findMany(),
      ])
      return data
      }
      
      const [data, total] = await Promise.all([
        (ctx.db as any)[tableName].findMany({
          skip,
          take: perPage,
          orderBy: {
            id: 'desc',
          },
        }),
        (ctx.db as any)[tableName].count(),
      ]);

      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      };
    });

export const listRouter = createTRPCRouter({
  link: createTipListProcedure("links"),
  categories: createTipListProcedure("categories"),
  beautyTip: createTipListProcedure("beautyTips"),
  equipmentTip: createTipListProcedure("equipmentTips"),
  foodTip: createTipListProcedure("foodTips"),
  healthTip: createTipListProcedure("healthTips"),
  homeTip: createTipListProcedure("homeTips"),
  petTip: createTipListProcedure("petTips"),
  clothTip: createTipListProcedure("clothTips"),
  plantTip: createTipListProcedure("plantTips"),
  machineryTip: createTipListProcedure("machineryTips"),
  rideTip: createTipListProcedure("rideTips"),
  leisureTip: createTipListProcedure("leisureTips"),
  energyTip: createTipListProcedure("energyTips"),
  video: createTipListProcedure("videos"),
  coin: publicProcedure
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
  category: publicProcedure
    .input(paginationInput)
    .query(async ({ ctx, input }) => {
      const { page, perPage } = input;
      const skip = (page - 1) * (perPage||10);

      const [data, total] = await Promise.all([
        ctx.db.categories.findMany({
          skip,
          take: perPage,
          orderBy: {
            id: 'desc',
          },
        }),
        ctx.db.categories.count(),
      ]);

      return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / (perPage||10)),
      };
    }),
});
