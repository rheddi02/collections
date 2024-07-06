import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const beautyRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.beautyTips.create({
        data: {...input}
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1),
        description: z.string().default(''),
        url: z.string(),
        type: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.beautyTips.update({
        where: { id: input.id },
        data: { ...input },
      });
    }),
  get: publicProcedure.input(
    z.object({
      page: z.number(),
      perPage: z.number()
    })
  ).query( async ({ ctx,input }) => {
    const data = await ctx.db.beautyTips.findMany({ 
      skip: (input.page-1) * input.perPage,
      take: input.perPage,
    })
    const total = await ctx.db.beautyTips.count()
    return { data, total }
  }),
  show: publicProcedure.input(z.number()).query(({ ctx,input }) => {
    return ctx.db.beautyTips.findUnique({
      where: {
        id: input
      }
    })
  }),
  delete: publicProcedure.input(z.number()).mutation( async ({ input, ctx }) => {
    return await ctx.db.beautyTips.delete({
      where: {
        id: input
      }
    })
  }),

});
