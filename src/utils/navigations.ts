"use client";
import type { NavigationType } from "./types";
import useAppStore from "~/store/app.store";
import { useMemo } from "react";

// Hook to get navigation lists that watches for categories changes
export const useNavigationLists = (): NavigationType[] => {
  const categories = useAppStore((state) => state.categories);
  
  return useMemo(() => [
    {
      title: "dashboard",
      route: "/admin/dashboard",
      subRoute: [],
      image: "",
    },
    ...categories.map((category) => ({
      title: category.title,
      route: "/admin/" + category.title.toLowerCase().replaceAll(" ", "-"),
      subRoute: [],
      description:
        category.description ||
        "Category management for organizing your content.",
    })),
  ], [categories]);
};
