import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const updateRouter = createTRPCRouter({
  beautyTip: publicProcedure
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
  equipmentTip: publicProcedure
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
  foodTip: publicProcedure
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
  healthTip: publicProcedure
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
  homeTip: publicProcedure
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
  petTip: publicProcedure
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
  clothTip: publicProcedure
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
  plantTip: publicProcedure
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
  machineryTip: publicProcedure
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
  rideTip: publicProcedure
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
  leisureTip: publicProcedure
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
  energyTip: publicProcedure
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
