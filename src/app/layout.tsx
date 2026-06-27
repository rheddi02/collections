import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import ClientProviders from "~/app/_components/client-providers";

export const metadata: Metadata = {
  title: "Collections",
  description: "Manage your link collections",
  manifest: "/manifest.json",
  themeColor: "#09090b",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable}`}
    >
      <body className="overscroll-none">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
