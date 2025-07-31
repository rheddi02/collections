import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure, publicProcedure } from "~/server/api/trpc";

// Generic update function for tips - NOW WITH OWNERSHIP SECURITY
const createTipUpdateProcedure = (tableName: string, entityName: string) =>
  authenticatedProcedure
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
      
      // SECURITY: Check if record exists AND belongs to authenticated user
      const existingRecord = await (ctx.db as any)[tableName].findUnique({
        where: { id },
      });

      if (!existingRecord) {
        throw new Error(`${entityName} not found`);
      }

      // CRITICAL SECURITY CHECK: Only allow users to update their own data
      if (existingRecord.userId !== parseInt(ctx.user.id)) {
        throw new Error(`Unauthorized: You can only update your own ${entityName.toLowerCase()}`);
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
  coin: publicProcedure
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
      
      // Simplified: just check if coin exists (no ownership validation for demo)
      const existingCoin = await ctx.db.coins.findUnique({
        where: { id },
      });

      if (!existingCoin) {
        throw new Error("Coin not found");
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
