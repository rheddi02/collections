import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const totalHomeTips = await ctx.db.homeTips.count();
    const totalHealthTips = await ctx.db.healthTips.count();
    const totalEquipmentTips = await ctx.db.equipmentTips.count();
    const totalBeautyTips = await ctx.db.beautyTips.count();
    return {
      totalHomeTips,
      totalHealthTips,
      totalEquipmentTips,
      totalBeautyTips,
    };
  }),
});
