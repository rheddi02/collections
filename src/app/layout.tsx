"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import Navigation from "./admin/_components/navigation";
import Passcode from "./admin/_components/passcode";
import DeleteCode from "./admin/_components/delete-code";
import useAppStore from "~/store/app.store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const passcode = useAppStore((state) => state.passcode);
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          {passcode.trim().length &&
          passcode == process.env.NEXT_PUBLIC_PASSCODE ? (
            <>
              <div className="flex gap-2 bg-gray-800 p-2 text-gray-300">
                <Navigation />
                <div className="h-[98vh] w-full overflow-auto rounded-md bg-gray-50 p-2 text-gray-800">
                  {children}
                </div>
                <Toaster />
                <Passcode />
                <DeleteCode />
              </div>
            </>
          ) : (
            <>{children}</>
          )}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
