import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

// Generic update function for tips with ownership validation
const createTipUpdateProcedure = (tableName: string, entityName: string) =>
  protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        isPublic: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // First check if the record exists and belongs to the user
      const existingRecord = await (ctx.db as any)[tableName].findFirst({
        where: {
          id,
          userId: ctx.user.id,
        },
      });

      if (!existingRecord) {
        throw new Error(`${entityName} not found or you don't have permission to update it`);
      }

      return await (ctx.db as any)[tableName].update({
        where: { id },
        data: updateData,
      });
    });

export const updateRouter = createTRPCRouter({
  beautyTip: createTipUpdateProcedure("beautyTips", "Beauty tip"),
  equipmentTip: createTipUpdateProcedure("equipmentTips", "Equipment tip"),
  foodTip: createTipUpdateProcedure("foodTips", "Food tip"),
  healthTip: createTipUpdateProcedure("healthTips", "Health tip"),
  homeTip: createTipUpdateProcedure("homeTips", "Home tip"),
  petTip: createTipUpdateProcedure("petTips", "Pet tip"),
  clothTip: createTipUpdateProcedure("clothTips", "Cloth tip"),
  plantTip: createTipUpdateProcedure("plantTips", "Plant tip"),
  machineryTip: createTipUpdateProcedure("machineryTips", "Machinery tip"),
  rideTip: createTipUpdateProcedure("rideTips", "Ride tip"),
  leisureTip: createTipUpdateProcedure("leisureTips", "Leisure tip"),
  energyTip: createTipUpdateProcedure("energyTips", "Energy tip"),
  video: createTipUpdateProcedure("videos", "Video"),
  coin: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        categoryId: z.number(),
        description: z.string().default(""),
        year: z.string(),
        type: z.enum(["NEW", "OLD", "SPECIAL"]),
        url: z.string(),
        isPublic: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Check ownership
      const existingCoin = await ctx.db.coins.findFirst({
        where: {
          id,
          userId: ctx.user.id,
        },
      });

      if (!existingCoin) {
        throw new Error("Coin not found or you don't have permission to update it");
      }

      return await ctx.db.coins.update({
        where: { id },
        data: updateData,
      });
    }),
  category: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      
      // Check if category exists
      const existingCategory = await ctx.db.categories.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new Error("Category not found");
      }

      return await ctx.db.categories.update({
        where: { id },
        data: updateData,
      });
    }),
});
