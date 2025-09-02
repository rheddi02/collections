import { z } from "zod";

export const filterSchema = z.string().min(1, "URL is required");

export const filterFormSchema = z.object({
  keyword: filterSchema,
});
export type FilterFormValues = z.infer<typeof filterFormSchema>;
