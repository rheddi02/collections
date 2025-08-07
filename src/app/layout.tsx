"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import AuthProvider from "~/components/AuthProvider";
import { SessionDebug } from "~/components/SessionDebug";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="overscroll-none">
        <AuthProvider>
          <TRPCReactProvider>
            {children}
            <Toaster />
            {/* <SessionDebug /> */}
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
