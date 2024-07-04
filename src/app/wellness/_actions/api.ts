"use server";

import type {
  wellnessInput,
  wellnessOutput,
} from "~/server/api/client/types";
import { api } from "~/trpc/server";
import type { PageType } from "~/utils/types";

export const POST = async (
  data: wellnessInput,
): Promise<wellnessOutput> => {
  return await api.wellness.create({
    ...data,
  });
};
export const PUT = async (
  data: wellnessOutput,
): Promise<wellnessOutput> => {
  return await api.wellness.update({ ...data });
};
export const GET = async (data: PageType): Promise<{ data: wellnessOutput[] , total: number}> => {
  return await api.wellness.get(data);
};
export const DELETE = async (
  id: number,
): Promise<wellnessOutput> => {
  return await api.wellness.delete(id);
};
