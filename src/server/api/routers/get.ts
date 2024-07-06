import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const getRouter = createTRPCRouter({
  getBeautyTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.beautyTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getEquipmentTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.equipmentTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getFoodTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.foodTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getHealthTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.healthTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getHomeTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.homeTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getPetTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.petTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getClothTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.clothTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getPlantTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.plantTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getMachineryTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.machineryTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getRideTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.rideTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getLeisureTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.leisureTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  getEnergyTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.energyTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
});
