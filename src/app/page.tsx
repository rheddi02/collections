// import Link from "next/link";
import { redirect } from "next/navigation";

// import { CreatePost } from "~/app/_components/create-post";
// import { api } from "~/trpc/server";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  redirect('/dashboard')
}
