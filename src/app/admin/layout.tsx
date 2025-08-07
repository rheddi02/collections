"use client";
import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import Navigation from "./_components/navigation";
import { GlobalConfirmDialog } from "./_components/global-confirm-dialog";
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
    api.list.categories.useQuery({});

  useEffect(() => {
    if (!isFetchedCategories || !categories) return;
    setCategories(categories as categoryOutput[]);
  }, [categories, isFetchedCategories]);

  return (
    <div className="flex h-screen bg-gray-800 text-gray-300">
      <Navigation />
      <div className="h-full w-full overflow-auto bg-transparent p-2 text-gray-800">
        <div className="h-full rounded-md bg-gray-100">{children}</div>
      </div>
      <GlobalConfirmDialog />
      <Toaster />
    </div>
  );
}
