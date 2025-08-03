import { z } from "zod";

import { createTRPCRouter, optionalAuthProcedure } from "~/server/api/trpc";

// Generic count function for tips with server-side user authentication
const createTipCountProcedure = (tableName: string) =>
  optionalAuthProcedure
    .query(async ({ ctx }) => {
      const user = ctx.user;
      
      // If user is authenticated, show their data + public data
      // If not authenticated, only show public data
      const whereClause = user 
        ? {
            OR: [
              { userId: parseInt(user.id) }, // User's own data
              { isPublic: true }, // All public data
            ],
          }
        : { isPublic: true }; // Only public data for unauthenticated users

      return await (ctx.db as any)[tableName].count({
        where: whereClause,
      });
    });

// Optimized: Get all counts in a single query with server-side auth
const getAllCounts = optionalAuthProcedure
  .query(async ({ ctx }) => {
    const user = ctx.user;
    const whereClause = user 
      ? {
          OR: [
            { userId: parseInt(user.id) },
            { isPublic: true },
          ],
        }
      : { isPublic: true };

    // Execute all count queries in parallel
    const [
      link,
      beautyTip,
      equipmentTip,
      foodTip,
      healthTip,
      homeTip,
      petTip,
      clothTip,
      plantTip,
      machineryTip,
      rideTip,
      leisureTip,
      energyTip,
    ] = await Promise.all([
      ctx.db.links.count({ where: whereClause }),
      ctx.db.beautyTips.count({ where: whereClause }),
      ctx.db.equipmentTips.count({ where: whereClause }),
      ctx.db.foodTips.count({ where: whereClause }),
      ctx.db.healthTips.count({ where: whereClause }),
      ctx.db.homeTips.count({ where: whereClause }),
      ctx.db.petTips.count({ where: whereClause }),
      ctx.db.clothTips.count({ where: whereClause }),
      ctx.db.plantTips.count({ where: whereClause }),
      ctx.db.machineryTips.count({ where: whereClause }),
      ctx.db.rideTips.count({ where: whereClause }),
      ctx.db.leisureTips.count({ where: whereClause }),
      ctx.db.energyTips.count({ where: whereClause }),
    ]);

    return {
      link,
      beautyTip,
      equipmentTip,
      foodTip,
      healthTip,
      homeTip,
      petTip,
      clothTip,
      plantTip,
      machineryTip,
      rideTip,
      leisureTip,
      energyTip,
    };
  });

export const countRouter = createTRPCRouter({
  // Individual endpoints (keep for backward compatibility)
  link: createTipCountProcedure("links"),
  beautyTip: createTipCountProcedure("beautyTips"),
  equipmentTip: createTipCountProcedure("equipmentTips"),
  foodTip: createTipCountProcedure("foodTips"),
  healthTip: createTipCountProcedure("healthTips"),
  homeTip: createTipCountProcedure("homeTips"),
  petTip: createTipCountProcedure("petTips"),
  clothTip: createTipCountProcedure("clothTips"),
  plantTip: createTipCountProcedure("plantTips"),
  machineryTip: createTipCountProcedure("machineryTips"),
  rideTip: createTipCountProcedure("rideTips"),
  leisureTip: createTipCountProcedure("leisureTips"),
  energyTip: createTipCountProcedure("energyTips"),
  
  // Optimized batch endpoint
  all: getAllCounts,
});
