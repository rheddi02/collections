import { Type } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const createRouter = createTRPCRouter({
  beautyTip: publicProcedure
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
  equipmentTip: publicProcedure
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
  foodTip: publicProcedure
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
  healthTip: publicProcedure
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
  homeTip: publicProcedure
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
  petTip: publicProcedure
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
  clothTip: publicProcedure
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
  plantTip: publicProcedure
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
  machineryTip: publicProcedure
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
  rideTip: publicProcedure
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
  leisureTip: publicProcedure
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
  energyTip: publicProcedure
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
  video: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.videos.create({
        data: {...input}
      });
    }),
  coin: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        categoryId: z.number(),
        description: z.string().default(''),
        year: z.string(),
        type: z.enum(['NEW', 'OLD','SPECIAL']),
        url: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.coins.create({
        data: {...input}
      });
    }),
  category: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.categories.create({
        data: {...input}
      });
    }),
});
