import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dashboardRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const counts = await ctx.db.$transaction( async (db) => {
      const totalHomeTips = await db.homeTips.count();
      const totalHealthTips = await db.healthTips.count();
      const totalEquipmentTips = await db.equipmentTips.count();
      const totalBeautyTips = await db.beautyTips.count();
      const totalFoodTips = await db.foodTips.count();
      const totalPetTips = await db.petTips.count();
      const totalClothTips = await db.clothTips.count();
      const totalPlantTips = await db.plantTips.count();
      const totalMachineryTips = await db.machineryTips.count();
      const totalRideTips = await db.rideTips.count();
      const totalLeisureTips = await db.leisureTips.count();
      const totalEnergyTips = await db.energyTips.count();
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
    })
    return counts
  }),
});
