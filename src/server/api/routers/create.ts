import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const createRouter = createTRPCRouter({
  createBeautyTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.beautyTips.create({
        data: {...input}
      });
    }),
  createEquipmentTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.equipmentTips.create({
        data: {...input}
      });
    }),
  createFoodTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodTips.create({
        data: {...input}
      });
    }),
  createHealthTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.healthTips.create({
        data: {...input}
      });
    }),
  createHomeTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.homeTips.create({
        data: {...input}
      });
    }),
  createPetTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.petTips.create({
        data: {...input}
      });
    }),
  createClothTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.clothTips.create({
        data: {...input}
      });
    }),
  createPlantTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.plantTips.create({
        data: {...input}
      });
    }),
  createMachineryTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.machineryTips.create({
        data: {...input}
      });
    }),
  createRideTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.rideTips.create({
        data: {...input}
      });
    }),
  createLeisureTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.leisureTips.create({
        data: {...input}
      });
    }),
  createEnergyTip: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.energyTips.create({
        data: {...input}
      });
    }),
});
