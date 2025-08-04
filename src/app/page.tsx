"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      if (session) {
        router.push("/admin/dashboard");
      } else {
        router.push("/auth/signin");
      }
    }
  }, [session, status, router]);

  // Show loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
}
