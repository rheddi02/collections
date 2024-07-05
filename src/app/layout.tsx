import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import Navigation from "./_components/navigation";
import { Toaster } from "~/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <div className="flex gap-2 bg-gray-800 text-gray-300 p-2">
            <Navigation />
            <div className="h-[98vh] w-full overflow-auto rounded-md p-2 bg-gray-50 text-gray-800">{children}</div>
            <Toaster />
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
