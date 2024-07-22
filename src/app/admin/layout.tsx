"use client";
import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import Navigation from "./_components/navigation";
import DeleteCode from "./_components/delete-code";
import useAppStore from "~/store/app.store";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const passcode = useAppStore((state) => state.passcode);
  if (!passcode.trim()) redirect('/client')
    
  return (
    passcode.trim().length > 0 &&
    passcode == process.env.NEXT_PUBLIC_PASSCODE && (
      <>
        <div className="flex gap-2 bg-gray-800 p-2 text-gray-300">
          <Navigation />
          <div className="h-[98vh] w-full overflow-auto rounded-md bg-gray-50 p-2 text-gray-800">
            {children}
          </div>
          <Toaster />
          <DeleteCode />
        </div>
      </>
    )
  );
}
