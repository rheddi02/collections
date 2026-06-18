import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).default(10),
});

export type PaginationType = z.infer<typeof paginationSchema>
