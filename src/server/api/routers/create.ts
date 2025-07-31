import { Type } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure, publicProcedure } from "~/server/api/trpc";

// Generic create function for tips - NOW WITH PROPER AUTH SECURITY
const createTipCreateProcedure = (tableName: string) =>
  authenticatedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(""),
        url: z.string(),
        type: z.string(),
        isPublic: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // SECURITY: Only authenticated users can create, data is linked to their user ID
      return await (ctx.db as any)[tableName].create({
        data: {
          ...input,
          userId: parseInt(ctx.user.id), // Use authenticated user's ID
        },
      });
    });

export const createRouter = createTRPCRouter({
  beautyTip: createTipCreateProcedure("beautyTips"),
  equipmentTip: createTipCreateProcedure("equipmentTips"),
  foodTip: createTipCreateProcedure("foodTips"),
  healthTip: createTipCreateProcedure("healthTips"),
  homeTip: createTipCreateProcedure("homeTips"),
  petTip: createTipCreateProcedure("petTips"),
  clothTip: createTipCreateProcedure("clothTips"),
  plantTip: createTipCreateProcedure("plantTips"),
  machineryTip: createTipCreateProcedure("machineryTips"),
  rideTip: createTipCreateProcedure("rideTips"),
  leisureTip: createTipCreateProcedure("leisureTips"),
  energyTip: createTipCreateProcedure("energyTips"),
  video: createTipCreateProcedure("videos"),
  coin: authenticatedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        categoryId: z.number(),
        description: z.string().default(""),
        year: z.string(),
        type: z.enum(["NEW", "OLD", "SPECIAL"]),
        url: z.string(),
        isPublic: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // SECURITY: Only authenticated users can create coins
      return await ctx.db.coins.create({
        data: { ...input, userId: parseInt(ctx.user.id) },
      });
    }),
  category: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(""),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.categories.create({
        data: { ...input },
      });
    }),
});
