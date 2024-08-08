import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const PAGE_LIMIT = 100

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
