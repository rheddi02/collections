import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const deleteRouter = createTRPCRouter({
  beautyTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.beautyTips.delete({
        where: {
          id: input,
        },
      });
    }),
  equipmentTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.equipmentTips.delete({
        where: {
          id: input,
        },
      });
    }),
  foodTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.foodTips.delete({
        where: {
          id: input,
        },
      });
    }),
  healthTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.healthTips.delete({
        where: {
          id: input,
        },
      });
    }),
  homeTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.homeTips.delete({
        where: {
          id: input,
        },
      });
    }),
  petTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.petTips.delete({
        where: {
          id: input,
        },
      });
    }),
  clothTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.clothTips.delete({
        where: {
          id: input,
        },
      });
    }),
  plantTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.plantTips.delete({
        where: {
          id: input,
        },
      });
    }),
  machineryTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.machineryTips.delete({
        where: {
          id: input,
        },
      });
    }),
  rideTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.rideTips.delete({
        where: {
          id: input,
        },
      });
    }),
  leisureTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.leisureTips.delete({
        where: {
          id: input,
        },
      });
    }),
  energyTip: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.energyTips.delete({
        where: {
          id: input,
        },
      });
    }),
});
