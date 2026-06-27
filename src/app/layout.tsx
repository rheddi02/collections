"use client";
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { SessionDebug } from "~/components/SessionDebug";
import { SessionProvider } from "next-auth/react";
import { GlobalDialogProvider } from "~/hooks/useGlobalDialog";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { steps } from "~/utils/tour-steps";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
  const completed = localStorage.getItem("tourCompleted");
  setRunTour(!completed);
}, []);

  const handleTourEnd = () => {
    localStorage.setItem("tourCompleted", "true");
    setRunTour(false);
  };
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable}`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09090b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="overscroll-none">
        <Joyride
          steps={steps}
          run={runTour}
          continuous={true}
          showSkipButton={false}
          showProgress={true}
          disableOverlayClose={true}
          hideCloseButton={true}
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
          locale={{
            next: "Next",
            back: "Back",
            skip: "Skip",
            last: "Close", // this is used for the last step
          }}
          callback={(data) => {
            if (data.status === "finished" || data.status === "skipped") {
              handleTourEnd();
            }
          }}
        />
        <ThemeProvider defaultTheme="dark" storageKey="collections-theme">
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
