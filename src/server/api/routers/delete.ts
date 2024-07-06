import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const deleteRouter = createTRPCRouter({
  deleteBeautyTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.beautyTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteEquipmentTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.equipmentTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteFoodTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteHealthTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.healthTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteHomeTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.homeTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deletePetTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.petTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteClothTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.clothTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deletePlantTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.plantTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteMachineryTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.machineryTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteRideTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.rideTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteLeisureTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.leisureTips.delete({
        where: {
          id: input,
        },
      });
    }),
  deleteEnergyTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.energyTips.delete({
        where: {
          id: input,
        },
      });
    }),
});
