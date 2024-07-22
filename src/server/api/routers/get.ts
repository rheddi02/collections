import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const getRouter = createTRPCRouter({
  beautyTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.beautyTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  equipmentTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.equipmentTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  foodTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.foodTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  healthTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.healthTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  homeTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.homeTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  petTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.petTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  clothTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.clothTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  plantTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.plantTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  machineryTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.machineryTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  rideTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.rideTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  leisureTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.leisureTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
  energyTip: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.energyTips.findUnique({
        where: {
          id: input,
        },
      });
    }),
    video: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await ctx.db.videos.findUnique({
        where: {
          id: input,
        },
      });
    }),
});
