import "dotenv/config";
import { defineConfig, env } from "prisma/config";

type Env = {
  POSTGRES_PRISMA_URL: string
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { 
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: { 
    url: process.env.POSTGRES_PRISMA_URL ?? env<Env>('POSTGRES_PRISMA_URL'),
  }
});