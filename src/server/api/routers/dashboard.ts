import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const totalHomeTips = await ctx.db.homeTips.count();
    const totalHealthTips = await ctx.db.healthTips.count();
    const totalEquipmentTips = await ctx.db.equipmentTips.count();
    const totalBeautyTips = await ctx.db.beautyTips.count();
    const totalFoodTips = await ctx.db.foodTips.count();
    const totalPetTips = await ctx.db.petTips.count();
    const totalClothTips = await ctx.db.clothTips.count();
    const totalPlantTips = await ctx.db.plantTips.count();
    const totalMachineryTips = await ctx.db.machineryTips.count();
    const totalRideTips = await ctx.db.rideTips.count();
    const totalLeisureTips = await ctx.db.leisureTips.count();
    const totalEnergyTips = await ctx.db.energyTips.count();
    return {
      totalHomeTips,
      totalHealthTips,
      totalEquipmentTips,
      totalBeautyTips,
      totalFoodTips,
      totalPetTips,
      totalClothTips,
      totalPlantTips,
      totalMachineryTips,
      totalRideTips,
      totalLeisureTips,
      totalEnergyTips,
    };
  }),
});
