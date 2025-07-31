"use client";
import { useSession } from "next-auth/react";

export const SessionDebug = () => {
  const { data: session, status } = useSession();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs max-w-xs">
      <div>Status: {status}</div>
      <div>Session: {session ? "✅" : "❌"}</div>
      {session && (
        <div>User: {session.user?.email}</div>
      )}
    </div>
  );
};
