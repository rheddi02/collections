"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Check for existing auth token
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      redirect("/admin/dashboard");
    } else {
      redirect("/client");
    }
  }, []);
  // const hello = await api.post.hello({ text: "from tRPC" });
  // redirect('/admin')
}
