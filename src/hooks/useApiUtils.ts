import { api } from "~/trpc/react";

/**
 * Custom hook that provides access to tRPC utils
 * Centralizes the `api.useUtils()` call to avoid repetition
 * 
 * @returns tRPC utils object with all invalidate, fetch, and refetch methods
 * 
 * @example
 * ```tsx
 * const utils = useApiUtils();
 * 
 * // Invalidate queries
 * await utils.list.categories.invalidate();
 * 
 * // Fetch data
 * const categories = await utils.list.categories.fetch();
 * ```
 */
export const useApiUtils = () => {
  return api.useUtils();
};
