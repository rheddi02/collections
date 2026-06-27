import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "~/lib/auth-config";

export default async function Home() {
  const session = await getServerSession(authOptions);
  redirect(session ? "/admin/dashboard" : "/auth/signin");
}
