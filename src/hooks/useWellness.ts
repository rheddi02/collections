import {
  useMutation,
  type UseMutationResult,
  type UseQueryResult,
  useQuery,
} from "@tanstack/react-query";
import { GET, POST, PUT } from "~/app/wellness/_actions/api";
import type {
  wellnessInput,
  wellnessOutput,
} from "~/server/api/client/types";
import type { PageType } from "~/utils/types";

export const create = async ({
  title,
  description,
  type,
  url,
}: wellnessInput): Promise<wellnessOutput> => {
  return await POST({ title, description, type, url });
};
export const update = async (
  data: wellnessOutput,
): Promise<wellnessOutput> => {
  return await PUT({ ...data });
};

export const get = async (data: PageType): Promise<{ data: wellnessOutput[], total: number}> => {
  return await GET(data);
};

export const useCreateWellness = (
  onSuccess: (data: wellnessOutput) => Promise<void>,
): UseMutationResult<
  wellnessOutput,
  unknown,
  wellnessInput
> => {
  return useMutation({
    mutationKey: ["wellness-create"],
    mutationFn: async (data: wellnessInput) =>
      await create(data),
    onSuccess,
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useUpdateWellness = (
  onSuccess: (data: wellnessOutput) => Promise<void>,
): UseMutationResult<
  wellnessOutput,
  unknown,
  wellnessOutput
> => {
  return useMutation({
    mutationKey: ["wellness-update"],
    mutationFn: async (data: wellnessOutput) =>
      await update(data),
    onSuccess,
    onError: (err) => {
      console.error(err);
    },
  });
};

export const useWellness = (data: PageType): UseQueryResult<
{ data: wellnessOutput[], total: number},
  unknown
> => {
  return useQuery({
    queryKey: ["wellness", data.page, data.perPage],
    queryFn: async () => await get(data),
  });
};

