/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */

interface User {
  id: string;
  email: string;
  name?: string;
}

// Simple context that receives session from the API route
interface CreateContextOptions {
  session?: any;
  user?: User | null;
  headers?: Headers;
  db?: typeof db;
}

export const createTRPCContext = (opts: CreateContextOptions) => {
  
  return {
    db: opts.db ?? db,
    session: opts.session || null,
    user: opts.user || null,
    headers: opts.headers,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

/**
 * Authenticated procedure - NextAuth Session-based
 *
 * This procedure ensures that a user is authenticated via NextAuth before executing.
 * You can access the user via ctx.user
 */
export const authenticatedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    console.error("UNAUTHORIZED: No session or user found");
    throw new Error("UNAUTHORIZED: Please sign in to access this resource");
  }
  
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user, // Type-safe user access
    },
  });
});

/**
 * Optional authenticated procedure - works with or without auth
 *
 * This procedure works for both authenticated and unauthenticated users.
 * Check ctx.user to see if user is authenticated.
 */
export const optionalAuthProcedure = t.procedure.use(async ({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      user: ctx.user, // May be null
    },
  });
});
