import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Generic get function for tips
const createTipGetProcedure = (tableName: string) =>
  publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await (ctx.db as any)[tableName].findUnique({
        where: {
          id: input,
        },
      });
    });

export const getRouter = createTRPCRouter({
  link: createTipGetProcedure("links"),
  beautyTip: createTipGetProcedure("beautyTips"),
  equipmentTip: createTipGetProcedure("equipmentTips"),
  foodTip: createTipGetProcedure("foodTips"),
  healthTip: createTipGetProcedure("healthTips"),
  homeTip: createTipGetProcedure("homeTips"),
  petTip: createTipGetProcedure("petTips"),
  clothTip: createTipGetProcedure("clothTips"),
  plantTip: createTipGetProcedure("plantTips"),
  machineryTip: createTipGetProcedure("machineryTips"),
  rideTip: createTipGetProcedure("rideTips"),
  leisureTip: createTipGetProcedure("leisureTips"),
  energyTip: createTipGetProcedure("energyTips"),
  video: createTipGetProcedure("videos"),
  coin: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.coins.findUnique({
        where: {
          id: input,
        },
        include: {
          categories: true,
        },
      });
    }),
  category: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.categories.findUnique({
        where: {
          id: input,
        },
      });
    }),
});
