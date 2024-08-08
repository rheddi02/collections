import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const listRouter = createTRPCRouter({
  beautyTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.beautyTips.count();
      if (input.page) {
        const data = await ctx.db.beautyTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.beautyTips.findMany();
        return { data, total };
      }
    }),
  equipmentTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.equipmentTips.count();
      if (input.page) {
        const data = await ctx.db.equipmentTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.equipmentTips.findMany();
        return { data, total };
      }
    }),
  foodTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.foodTips.count();
      if (input.page) {
        const data = await ctx.db.foodTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.foodTips.findMany();
        return { data, total };
      }
    }),
  healthTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.healthTips.count();
      if (input.page) {
        const data = await ctx.db.healthTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.healthTips.findMany();
        return { data, total };
      }
    }),
  homeTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.homeTips.count();
      if (input.page) {
        const data = await ctx.db.homeTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.homeTips.findMany();
        return { data, total };
      }
    }),
  petTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.petTips.count();
      if (input.page) {
        const data = await ctx.db.petTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.petTips.findMany();
        return { data, total };
      }
    }),
  clothTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.clothTips.count();
      if (input.page) {
        const data = await ctx.db.clothTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.clothTips.findMany();
        return { data, total };
      }
    }),
  plantTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.plantTips.count();
      if (input.page) {
        const data = await ctx.db.plantTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.plantTips.findMany();
        return { data, total };
      }
    }),
  machineryTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
        filters: z.object({
          search: z.string(),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.machineryTips.count();
      if (input?.filters?.search.trim()) {
        const data = await ctx.db.$queryRawUnsafe(
          `SELECT * FROM "MachineryTips" WHERE "description" LIKE '%${input.filters.search}%'`,
        );
        return { data, total: 100 };
      }
      if (input.page) {
        const data = await ctx.db.machineryTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.machineryTips.findMany();
        return { data, total };
      }
    }),
  rideTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.rideTips.count();
      if (input.page) {
        const data = await ctx.db.rideTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.rideTips.findMany();
        return { data, total };
      }
    }),
  leisureTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.leisureTips.count();
      if (input.page) {
        const data = await ctx.db.leisureTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.leisureTips.findMany();
        return { data, total };
      }
    }),
  energyTip: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.energyTips.count();
      if (input.page) {
        const data = await ctx.db.energyTips.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.energyTips.findMany();
        return { data, total };
      }
    }),
  video: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.videos.count();
      if (input.page) {
        const data = await ctx.db.videos.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.videos.findMany();
        return { data, total };
      }
    }),
  coin: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.coins.count();
      if (input.page) {
        const data = await ctx.db.coins.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            createdAt: "desc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.coins.findMany();
        return { data, total };
      }
    }),
  category: publicProcedure
    .input(
      z.object({
        page: z.number().optional(),
        perPage: z.number().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const total = await ctx.db.categories.count();
      if (input.page) {
        const data = await ctx.db.categories.findMany({
          skip: (input.page - 1) * input.perPage,
          take: input.perPage,
          orderBy: {
            title: "asc",
          },
        });
        return { data, total };
      } else {
        const data = await ctx.db.categories.findMany();
        return { data, total };
      }
    }),
});
