"use client";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import useAppStore from "~/store/app.store";
import { useRouter } from "next/navigation";
import { SocialIcon } from "react-social-icons";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: ReactNode }) => {
  const appStore = useAppStore();
  const router = useRouter();
  const { data: session } = useSession();

  const handleChangeRole = () => {
    if (session) router.push("/admin/dashboard");
    else appStore.setCredentialsModal(true);
  };
  return (
    <main className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50 flex w-full items-center justify-between bg-white p-5 shadow-lg">
        <div>
          <Link href={"/"} className="font-bold">
            Collections
          </Link>
        </div>
        <Button variant={"ghost"} onClick={handleChangeRole}>
          admin
        </Button>
      </div>
      <section className="flex-1 pb-32">
        <Suspense>{children}</Suspense>
      </section>
      <footer className="mt-auto w-full bg-gray-300 p-10">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="flex gap-3">
            <SocialIcon url="https://facebook.com/rheddi02" target="_blank" />
            <SocialIcon
              url="https://www.instagram.com/rheddi02/"
              target="_blank"
            />
            <SocialIcon url="https://x.com/rheddi02" target="_blank" />
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Layout;
