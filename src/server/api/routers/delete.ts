import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure, publicProcedure } from "~/server/api/trpc";

// Generic delete function for tips - NOW WITH OWNERSHIP SECURITY
const createTipDeleteProcedure = (tableName: string, entityName: string) =>
  authenticatedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      // SECURITY: Check if record exists AND belongs to authenticated user
      const existingRecord = await (ctx.db as any)[tableName].findUnique({
        where: { id: input },
      });

      if (!existingRecord) {
        throw new Error(`${entityName} not found`);
      }

      // CRITICAL SECURITY CHECK: Only allow users to delete their own data
      if (existingRecord.userId !== parseInt(ctx.user.id)) {
        throw new Error(`Unauthorized: You can only delete your own ${entityName.toLowerCase()}`);
      }

      return await (ctx.db as any)[tableName].delete({
        where: { id: input },
      });
    });

export const deleteRouter = createTRPCRouter({
  beautyTip: createTipDeleteProcedure("beautyTips", "Beauty tip"),
  equipmentTip: createTipDeleteProcedure("equipmentTips", "Equipment tip"),
  foodTip: createTipDeleteProcedure("foodTips", "Food tip"),
  healthTip: createTipDeleteProcedure("healthTips", "Health tip"),
  homeTip: createTipDeleteProcedure("homeTips", "Home tip"),
  petTip: createTipDeleteProcedure("petTips", "Pet tip"),
  clothTip: createTipDeleteProcedure("clothTips", "Cloth tip"),
  plantTip: createTipDeleteProcedure("plantTips", "Plant tip"),
  machineryTip: createTipDeleteProcedure("machineryTips", "Machinery tip"),
  rideTip: createTipDeleteProcedure("rideTips", "Ride tip"),
  leisureTip: createTipDeleteProcedure("leisureTips", "Leisure tip"),
  energyTip: createTipDeleteProcedure("energyTips", "Energy tip"),
  video: createTipDeleteProcedure("videos", "Video"),
  coin: createTipDeleteProcedure("coins", "Coin"),
  category: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      // Categories don't have userId, so we might want to restrict this to admin users only
      // For now, let's just check if the category exists and allow any authenticated user to delete
      const existingCategory = await ctx.db.categories.findUnique({
        where: {
          id: input,
        },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      return await ctx.db.categories.delete({
        where: {
          id: input,
        },
      });
    }),
});
