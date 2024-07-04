import {
  useMutation,
  type UseMutationResult,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { GET, POST, PUT } from "~/app/home-improvements/_actions/api";
import type {
  homeImprovementInput,
  homeImprovementOutput,
} from "~/server/api/client/types";
import type { PageType } from "~/utils/types";

export const createHomeImprovement = async ({
  title,
  description,
  type,
  url,
}: homeImprovementInput): Promise<homeImprovementOutput> => {
  return await POST({ title, description, type, url });
};
export const updateHomeImprovement = async (
  data: homeImprovementOutput,
): Promise<homeImprovementOutput> => {
  return await PUT({ ...data });
};

export const getHomeImprovements = async (data: PageType): Promise<{ data: homeImprovementOutput[], total: number}> => {
  return await GET(data);
};

export const useCreateHomeImprovement = (
  onSuccess: (data: homeImprovementOutput) => Promise<void>,
): UseMutationResult<
  homeImprovementOutput,
  unknown,
  homeImprovementInput
> => {
  return useMutation({
    mutationKey: ["home-improvement-create"],
    mutationFn: async (data: homeImprovementInput) =>
      await createHomeImprovement(data),
    onSuccess,
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useUpdateHomeImprovement = (
  onSuccess: (data: homeImprovementOutput) => Promise<void>,
): UseMutationResult<
  homeImprovementOutput,
  unknown,
  homeImprovementOutput
> => {
  return useMutation({
    mutationKey: ["home-improvement-update"],
    mutationFn: async (data: homeImprovementOutput) =>
      await updateHomeImprovement(data),
    onSuccess,
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useHomeImprovement = (data: PageType): UseQueryResult<
{ data: homeImprovementOutput[], total: number},
  unknown
> => {
  return useQuery({
    queryKey: ["home-improvements", data.page, data.perPage],
    queryFn: async () => await getHomeImprovements(data),
  });
};

