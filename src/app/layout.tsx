"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { SessionDebug } from "~/components/SessionDebug";
import { SessionProvider } from "next-auth/react";
import { GlobalDialogProvider } from "~/hooks/useGlobalDialog";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="overscroll-none">
        <SessionProvider>
          <TRPCReactProvider>
            <GlobalDialogProvider>
              {children}
              {/* <SessionDebug /> */}
            </GlobalDialogProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
