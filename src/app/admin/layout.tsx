"use client";
import "~/styles/globals.css";

import { Toaster } from "~/components/ui/toaster";
import Navigation from "./_components/navigation";
import useAppStore from "~/store/app.store";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuth } = useAppStore((state) => ({
    isAuth: state.isAuth,
  }));
  
  // Use useEffect to handle redirect on auth state changes
  useEffect(() => {
    if (!isAuth) {
      router.push('/client');
    }
  }, [isAuth, router]);
  
  // Don't render anything if not authenticated
  if (!isAuth) {
    return null;
  }
    
  return (
    isAuth ? (
      <>
        <div className="flex gap-2 bg-gray-800 p-2 text-gray-300">
          <Navigation />
          <div className="h-[98vh] w-full overflow-auto rounded-md bg-gray-50 p-2 text-gray-800">
            {children}
          </div>
          <Toaster />
        </div>
      </>
    ) : null
  );
}
