// src/app/admin/[type]/[id]/page.tsx
import React from "react";
import LinkDetails from "./link-details-client";

export default function Page({ params }: { params: { type: string; id: string } }) {
  const { id } = params;
  return <LinkDetails id={Number(id)} />;
}