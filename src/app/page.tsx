"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const passcode = localStorage.getItem("passcode");
    if (passcode?.trim()) {
      if (passcode == process.env.NEXT_PUBLIC_PASSCODE) redirect("/admin/dashboard");
    }
    redirect("/client");
  }, []);
  // const hello = await api.post.hello({ text: "from tRPC" });
  // redirect('/admin')
}
