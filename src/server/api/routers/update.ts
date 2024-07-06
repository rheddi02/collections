import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const updateRouter = createTRPCRouter({
  updateBeautyTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.beautyTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateEquipmentTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.equipmentTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateFoodTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateHealthTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.healthTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateHomeTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.homeTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updatePetTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.petTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateClothTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.clothTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updatePlantTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.plantTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateMachineryTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.machineryTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateRideTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.rideTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateLeisureTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.leisureTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  updateEnergyTip: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.energyTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
});
