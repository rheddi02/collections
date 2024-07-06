import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
// import { homeRouter } from "./routers/home-tip";
// import { beautyRouter } from "./routers/beauty-tip";
// import { healthRouter } from "./routers/health-tip";
// import { equipmentRouter } from "./routers/equipment-tip";
// import { foodRouter } from "./routers/food-tip";
import { dashboardRouter } from "./routers/dashboard";
import { createRouter } from "./routers/create";
import { updateRouter } from "./routers/update";
import { deleteRouter } from "./routers/delete";
import { listRouter } from "./routers/list";
import { getRouter } from "./routers/get";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // home: homeRouter,
  // beauty: beautyRouter,
  // health: healthRouter,
  // equipment: equipmentRouter,
  dashboard: dashboardRouter,
  // food: foodRouter,
  create: createRouter,
  update: updateRouter,
  delete: deleteRouter,
  list: listRouter,
  get: getRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
