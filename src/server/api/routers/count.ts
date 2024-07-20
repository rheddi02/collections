import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const countRouter = createTRPCRouter({
  beautyTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.beautyTips.count();
  }),
  equipmentTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.equipmentTips.count();
  }),
  foodTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.foodTips.count();
  }),
  healthTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.healthTips.count();
  }),
  homeTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.homeTips.count();
  }),
  petTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.petTips.count();
  }),
  clothTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.clothTips.count();
  }),
  plantTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.plantTips.count();
  }),
  machineryTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.machineryTips.count();
  }),
  rideTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.rideTips.count();
  }),
  leisureTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.leisureTips.count();
  }),
  energyTip: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.energyTips.count();
  }),
});
