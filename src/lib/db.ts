
import { env } from "~/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: env.POSTGRES_PRISMA_URL,
})
const prismaClientSingleton = () => {
  return new PrismaClient({adapter});
};

declare const globalThis: {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
} & typeof global;
export const db = globalThis.prismaGlobal || prismaClientSingleton();

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = db;