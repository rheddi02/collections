import { createTRPCRouter, authenticatedProcedure, parseUserId } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: authenticatedProcedure.query(async ({ ctx }) => {
    const userId = parseUserId(ctx.user.id);

    const user = await ctx.db.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profile: true,
        cover: true,
        password: true,
      },
    });

    const [linkCount, categoryCount] = await Promise.all([
      ctx.db.links.count({ where: { userId } }),
      ctx.db.categories.count({ where: { userId } }),
    ]);

    const { password, ...userWithoutPassword } = user ?? {};

    return {
      ...userWithoutPassword,
      hasPassword: Boolean(password),
      linkCount,
      categoryCount,
    };
  }),
  
});
