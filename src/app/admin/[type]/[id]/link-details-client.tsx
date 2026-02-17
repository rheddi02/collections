// src/app/admin/[type]/[id]/link-details-client.tsx
"use client";

import React from "react";
import { api } from "~/trpc/react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function LinkDetails({ id }: { id: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, error } = api.links.get.useQuery(id, {
    enabled: Boolean(id),
  });

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No link found</div>;

  const goBack = () => {
    // remove the last path segment (the id) to go back to the list
    if (!pathname) return router.back();
    const base = pathname.replace(/\/[^/]+$/, "");
    router.push(base || "/");
  };

  return (
    <div className="p-5">
      <div className="mb-4">
        <Button variant="ghost" onClick={goBack}>
          ← Back to list
        </Button>
      </div>
      <div className="text-2xl">{data.title}</div>
      <p>{data.description}</p>
      <p>URL: {data.url}</p>
    </div>
  );
}