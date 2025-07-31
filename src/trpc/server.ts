import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/lib/auth-config";

import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  // Get session for server-side rendering context
  const session = await getServerSession(authOptions);
  
  return createTRPCContext({
    session,
    user: session?.user || null,
    headers: heads,
  });
});

export const api = createCaller(createContext);
