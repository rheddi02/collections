'use client'
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import PageModal from "./_components/page-modal";
import useAppStore from "~/store/app.store";
import { useRouter } from "next/navigation";

const Layout = ({ children }: { children: ReactNode }) => {
  const appStore = useAppStore()
  const router = useRouter()
  const handleChangeRole = () => {
    if (appStore.passcode)
      router.push('/admin/dashboard')
    else appStore.setPasscodeModal(true)
  }
  return (
    <div>
      <div className="flex w-full justify-between items-center p-5 shadow-lg">
        <div>
          <Link href={"/"} className="font-bold">Colletions</Link>
        </div>
        <Button variant={'ghost'} onClick={handleChangeRole}>admin</Button>
      </div>
      <Suspense>
        {children}
      </Suspense>
      <PageModal />
    </div>
  );
};

export default Layout;
