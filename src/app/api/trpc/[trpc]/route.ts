import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/lib/auth-config";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  // Get session directly in the API route handler
  const session = await getServerSession(authOptions);
  
  console.log("API Route - Session:", session ? "✅ Found" : "❌ Not found");
  console.log("API Route - User:", session?.user?.email || "No user");
  
  // Use the createTRPCContext function with session data
  return createTRPCContext({
    session,
    user: session?.user || null,
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
