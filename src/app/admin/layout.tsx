"use client";
import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import Navigation from "./_components/navigation";
import { GlobalConfirmDialog } from "./_components/global-confirm-dialog";
import { useEffect } from "react";
import useAppStore from "~/store/app.store";
import { api } from "~/trpc/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCategories } = useAppStore((state) => ({
    setCategories: state.setCategories,
  }));

  const { data: categories, isFetched: isFetchedCategories } =
    api.list.allCategories.useQuery(undefined, {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    });

  useEffect(() => {
    if (!isFetchedCategories || !categories) return;
    setCategories(categories);
  }, [categories, isFetchedCategories]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Navigation />
      <div className="h-full w-full overflow-auto p-2">
        <div className="h-full rounded-md border bg-card">{children}</div>
      </div>
      <GlobalConfirmDialog />
      <Toaster />
    </div>
  );
}
