import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Role } from "@/prisma/generated/enums";
import { createTRPCRouter, adminProcedure, parseUserId } from "~/server/api/trpc";

export const adminRouter = createTRPCRouter({
  stats: createTRPCRouter({
    overview: adminProcedure.query(async ({ ctx }) => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      const [totalUsers, verifiedUsers, newThisWeek, totalLinks, totalCategories] =
        await Promise.all([
          ctx.db.users.count(),
          ctx.db.users.count({ where: { isVerified: true } }),
          ctx.db.users.count({ where: { createdAt: { gte: weekAgo } } }),
          ctx.db.links.count(),
          ctx.db.categories.count(),
        ]);

      return { totalUsers, verifiedUsers, newThisWeek, totalLinks, totalCategories };
    }),

    userGrowth: adminProcedure
      .input(z.object({ days: z.number().min(7).max(90).default(30) }))
      .query(async ({ ctx, input }) => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - input.days);

        const users = await ctx.db.users.findMany({
          where: { createdAt: { gte: startDate } },
          select: { createdAt: true },
        });

        // Build a full date range filled with 0s, then populate counts
        const byDate = new Map<string, number>();
        for (let i = 0; i < input.days; i++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + i);
          byDate.set(d.toISOString().split("T")[0]!, 0);
        }
        for (const u of users) {
          const date = u.createdAt.toISOString().split("T")[0]!;
          byDate.set(date, (byDate.get(date) ?? 0) + 1);
        }

        return Array.from(byDate.entries()).map(([date, count]) => ({ date, count }));
      }),

    roleDistribution: adminProcedure.query(async ({ ctx }) => {
      const rows = await ctx.db.users.groupBy({
        by: ["role"],
        _count: { id: true },
      });
      return rows.map((r) => ({ role: r.role as string, count: r._count.id }));
    }),

    recentActivity: adminProcedure.query(async ({ ctx }) => {
      const [recentUsers, recentLinks, recentCategories] = await Promise.all([
        ctx.db.users.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { username: true, createdAt: true },
        }),
        ctx.db.links.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { title: true, createdAt: true, user: { select: { username: true } } },
        }),
        ctx.db.categories.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          select: { title: true, createdAt: true, user: { select: { username: true } } },
        }),
      ]);

      const events = [
        ...recentUsers.map((u) => ({
          type: "user" as const,
          label: `${u.username} joined`,
          at: u.createdAt,
        })),
        ...recentLinks.map((l) => ({
          type: "link" as const,
          label: `${l.user.username} added "${l.title}"`,
          at: l.createdAt,
        })),
        ...recentCategories.map((c) => ({
          type: "category" as const,
          label: `${c.user.username} created category "${c.title}"`,
          at: c.createdAt,
        })),
      ];

      return events.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 15);
    }),
  }),

  users: createTRPCRouter({
    list: adminProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          perPage: z.number().min(1).max(50).default(10),
          search: z.string().optional(),
          role: z.nativeEnum(Role).optional(),
          isVerified: z.boolean().optional(),
        }),
      )
      .query(async ({ ctx, input }) => {
        const { page, perPage, search, role, isVerified } = input;
        const skip = (page - 1) * perPage;

        const where = {
          ...(search && {
            OR: [
              { username: { contains: search, mode: "insensitive" as const } },
              { email: { contains: search, mode: "insensitive" as const } },
            ],
          }),
          ...(role !== undefined && { role }),
          ...(isVerified !== undefined && { isVerified }),
        };

        const [users, total] = await Promise.all([
          ctx.db.users.findMany({
            where,
            skip,
            take: perPage,
            orderBy: { createdAt: "desc" },
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              isVerified: true,
              createdAt: true,
              _count: { select: { categories: true, links: true } },
            },
          }),
          ctx.db.users.count({ where }),
        ]);

        return {
          data: users.map((u) => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role as string,
            isVerified: u.isVerified,
            createdAt: u.createdAt,
            categoryCount: u._count.categories,
            linkCount: u._count.links,
          })),
          totalPages: Math.ceil(total / perPage),
          total,
        };
      }),

    updateRole: adminProcedure
      .input(z.object({ id: z.number(), role: z.nativeEnum(Role) }))
      .mutation(async ({ ctx, input }) => {
        const selfId = parseUserId(ctx.user.id);
        if (input.id === selfId)
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot change your own role" });
        return ctx.db.users.update({ where: { id: input.id }, data: { role: input.role } });
      }),

    toggleVerify: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const user = await ctx.db.users.findUnique({
          where: { id: input.id },
          select: { isVerified: true },
        });
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        return ctx.db.users.update({
          where: { id: input.id },
          data: { isVerified: !user.isVerified },
        });
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const selfId = parseUserId(ctx.user.id);
        if (input.id === selfId)
          throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot delete yourself" });
        return ctx.db.users.delete({ where: { id: input.id } });
      }),
  }),
});
