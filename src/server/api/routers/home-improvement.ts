import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const homeImprovementRouter = createTRPCRouter({
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

      return ctx.db.homeImprovements.create({
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

      return ctx.db.homeImprovements.update({
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
    const data = await ctx.db.homeImprovements.findMany({ 
      skip: (input.page-1) * input.perPage,
      take: input.perPage,
    })
    const total = await ctx.db.homeImprovements.count()
    return { data, total }
  }),
  show: publicProcedure.input(z.number()).query(({ ctx,input }) => {
    return ctx.db.homeImprovements.findUnique({
      where: {
        id: input
      }
    })
  }),
  delete: publicProcedure.input(z.number()).query(({ input, ctx }) => {
    return ctx.db.homeImprovements.delete({
      where: {
        id: input
      }
    })
  }),

});
