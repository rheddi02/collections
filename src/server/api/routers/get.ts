import { z } from "zod";

import { createTRPCRouter, authenticatedProcedure } from "~/server/api/trpc";

// Generic get function for tips
const createTipGetProcedure = (tableName: string) =>
  authenticatedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return await (ctx.db as any)[tableName].findUnique({
        where: {
          id: input,
          userId: ctx.user.id
        },
      });
    });

export const getRouter = createTRPCRouter({
  link: createTipGetProcedure("links"),
  category: createTipGetProcedure("categories")
});
