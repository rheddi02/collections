"use client";
import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import Navigation from "./_components/navigation";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex gap-2 bg-gray-800 p-2 text-gray-300">
        <Navigation />
        <div className="h-[98vh] w-full overflow-auto rounded-md bg-gray-50 p-2 text-gray-800">
          {children}
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  );
}
