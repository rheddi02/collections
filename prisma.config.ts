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
    url: 'postgres://default:2r3gipyfFlVC@ep-damp-water-a166pxww-pooler.ap-southeast-1.aws.neon.tech/verceldb?pgbouncer=true&connect_timeout=15&sslmode=require'
  }
});