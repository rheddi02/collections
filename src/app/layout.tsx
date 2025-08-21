"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { SessionDebug } from "~/components/SessionDebug";
import { SessionProvider } from "next-auth/react";
import { GlobalDialogProvider } from "~/hooks/useGlobalDialog";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="overscroll-none">
        <ThemeProvider defaultTheme="light" storageKey="pokemon-explorer-theme">
        <SessionProvider>
          <TRPCReactProvider>
            <GlobalDialogProvider>
              {children}
              <Toaster />
              {/* <SessionDebug /> */}
            </GlobalDialogProvider>
          </TRPCReactProvider>
        </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
