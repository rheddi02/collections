"use client";
import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { GlobalDialogProvider } from "~/hooks/useGlobalDialog";
import { Toaster } from "~/components/ui/toaster";
import { ThemeProvider } from "~/components/theme-provider";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { steps } from "~/utils/tour-steps";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

export default function ClientProviders({ children }: { children: React.ReactNode }) {
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
    <ThemeProvider defaultTheme="dark" storageKey="collections-theme">
      <SessionProvider>
        <TRPCReactProvider>
          <GlobalDialogProvider>
            <Joyride
              steps={steps}
              run={runTour}
              continuous={true}
              showSkipButton={false}
              showProgress={true}
              disableOverlayClose={true}
              hideCloseButton={true}
              styles={{ options: { zIndex: 10000 } }}
              locale={{ next: "Next", back: "Back", skip: "Skip", last: "Close" }}
              callback={(data) => {
                if (data.status === "finished" || data.status === "skipped") {
                  handleTourEnd();
                }
              }}
            />
            {children}
            <Toaster />
          </GlobalDialogProvider>
        </TRPCReactProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
