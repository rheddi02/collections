"use client";
import type { NavigationType } from "../utils/types";
import useAppStore from "~/store/app.store";
import { useMemo } from "react";

// Hook to get navigation lists that watches for categories changes
export const useNavigationLists = (): NavigationType[] => {
  const categories = useAppStore((state) => state.categories);
  
  return useMemo(() => [
    {
      id: 0,
      title: "dashboard",
      route: "/admin/dashboard",
      subRoute: [],
      image: "",
    },
    ...categories.map((category) => ({
      id: category.id,
      title: category.title,
      route: "/admin/" + category.slug,
      subRoute: [],
    })),
  ], [categories]);
};
