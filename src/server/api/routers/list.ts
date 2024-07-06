import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  listBeautyTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.beautyTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.beautyTips.count();
      return { data, total };
    }),
  listEquipmentTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.equipmentTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.equipmentTips.count();
      return { data, total };
    }),
  listFoodTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.foodTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.foodTips.count();
      return { data, total };
    }),
  listHealthTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.healthTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.healthTips.count();
      return { data, total };
    }),
  listHomeTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.homeTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.homeTips.count();
      return { data, total };
    }),
  listPetTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.petTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.petTips.count();
      return { data, total };
    }),
  listClothTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.clothTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.clothTips.count();
      return { data, total };
    }),
  listPlantTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.plantTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.plantTips.count();
      return { data, total };
    }),
  listMachineryTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.machineryTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.machineryTips.count();
      return { data, total };
    }),
  listRideTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.rideTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.rideTips.count();
      return { data, total };
    }),
  listLeisureTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.leisureTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.leisureTips.count();
      return { data, total };
    }),
  listEnergyTip: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.energyTips.findMany({
        skip: (input.page - 1) * input.perPage,
        take: input.perPage,
        orderBy: {
          createdAt: 'desc'
        }
      });
      const total = await ctx.db.energyTips.count();
      return { data, total };
    }),
});
