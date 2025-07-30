"use client";
import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import CredentialsLogin from "./_components/credentials-login";
import { Toaster } from "~/components/ui/toaster";
import useAppStore from "~/store/app.store";
import { AuthProvider } from "~/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { credentialsModal, setCredentialsModal } = useAppStore((state) => ({
    credentialsModal: state.credentialsModal,
    setCredentialsModal: state.setCredentialsModal,
  }));

  const handleClose = () => {
    setCredentialsModal(false);
  };

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <AuthProvider>
          <TRPCReactProvider>
            {children}
            <CredentialsLogin 
              isOpen={credentialsModal} 
              onClose={handleClose} 
            />
            <Toaster />
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
