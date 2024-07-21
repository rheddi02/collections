"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { NavigationLists } from "~/utils/navigations";

const Page = () => {
  const [lists] = useState(NavigationLists);
  const router = useRouter()

  const handleOpenPage = (title: string) => {
    router.push(`/client/ui?page=${title}`)
  }
  return (
    <div className="p-5">
      <div className="flex gap-5 text-gray-100 flex-wrap">
        {lists.map((list,i) => {
          if (i !== 0) return <div
            className="flex h-96 w-64 items-center justify-center rounded-md bg-gray-500 relative overflow-hidden [&_*]:cursor-pointer hover:shadow-lg hover:border-2"
            key={list.title}
            onClick={() => handleOpenPage(list.title)}
          >
            <Image src={list.image!} alt="list.title" fill={true} className="object-cover" />
            <Label className="text-2xl capitalize z-10 tracking-widest bg-gray-900 px-5 py-1 rounded-full shadow-md">{list.title}</Label>
          </div>
          }
        )}
        </div>
    </div>
  );
};

export default Page;
