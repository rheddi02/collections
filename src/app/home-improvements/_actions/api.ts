"use server";

import type {
  homeImprovementInput,
  homeImprovementOutput,
} from "~/server/api/client/types";
import { api } from "~/trpc/server";
import type { PageType } from "~/utils/types";

export const POST = async (
  data: homeImprovementInput,
): Promise<homeImprovementOutput> => {
  return await api.homeImprovement.create({
    ...data,
  });
};
export const PUT = async (
  data: homeImprovementOutput,
): Promise<homeImprovementOutput> => {
  return await api.homeImprovement.update({ ...data });
};
export const GET = async (data: PageType): Promise<{ data: homeImprovementOutput[] , total: number}> => {
  return await api.homeImprovement.get(data);
};
export const DELETE = async (
  id: number,
): Promise<homeImprovementOutput> => {
  return await api.homeImprovement.delete(id);
};
