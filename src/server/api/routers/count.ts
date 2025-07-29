import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Generic count function for tips
const createTipCountProcedure = (tableName: string) =>
  publicProcedure.query(async ({ ctx }) => {
    return await (ctx.db as any)[tableName].count({
      where: {
        OR: [
          { userId: ctx.user?.id }, // All data from logged-in user
          { isPublic: true }, // All public data from any user
        ],
      },
    });
  });

export const countRouter = createTRPCRouter({
  beautyTip: createTipCountProcedure("beautyTips"),
  equipmentTip: createTipCountProcedure("equipmentTips"),
  foodTip: createTipCountProcedure("foodTips"),
  healthTip: createTipCountProcedure("healthTips"),
  homeTip: createTipCountProcedure("homeTips"),
  petTip: createTipCountProcedure("petTips"),
  clothTip: createTipCountProcedure("clothTips"),
  plantTip: createTipCountProcedure("plantTips"),
  machineryTip: createTipCountProcedure("machineryTips"),
  rideTip: createTipCountProcedure("rideTips"),
  leisureTip: createTipCountProcedure("leisureTips"),
  energyTip: createTipCountProcedure("energyTips"),
});
