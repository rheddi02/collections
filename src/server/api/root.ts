import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
// import { createRouter } from "./routers/create";
// import { updateRouter } from "./routers/update";
// import { deleteRouter } from "./routers/delete";
// import { getRouter } from "./routers/get";
// import { countRouter } from "./routers/count";
// import { listRouter } from "./routers/list";
// import { authRouter } from "./routers/auth";
// import { profileCountRouter } from "./routers/dashboard";
import { linkRouter } from "./routers/linkRouter";
import { categoryRouter } from "./routers/categoryRouter";
import { userRouter } from "./routers/userRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // auth: authRouter,
  // count: countRouter,
  // create: createRouter,
  // update: updateRouter,
  // delete: deleteRouter,
  // get: getRouter,
  // list: listRouter,
  links: linkRouter,
  categories: categoryRouter,
  users: userRouter,
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
