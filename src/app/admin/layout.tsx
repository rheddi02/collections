"use client";
import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import Navigation from "./_components/navigation";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { useEffect } from "react";
import useAppStore from "~/store/app.store";
import { api } from "~/trpc/react";
import { categoryOutput } from "~/server/api/client/types";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCategories } = useAppStore((state) => ({
    setCategories: state.setCategories,
  }));

  const { data: categories, isFetched: isFetchedCategories } =
    api.list.categories.useQuery();

  useEffect(() => {
    if (!isFetchedCategories || !categories) return;
    setCategories(categories as categoryOutput[]);
  }, [categories, isFetchedCategories]);

  return (
    <ProtectedRoute>
      <div className="flex gap-2 bg-gray-800 p-2 text-gray-300">
        <Navigation />
        <div className="h-[98vh] w-full overflow-auto rounded-md bg-gray-50 text-gray-800">
          {children}
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
