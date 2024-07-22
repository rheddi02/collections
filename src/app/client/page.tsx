"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import useAppStore from "~/store/app.store";
import { NavigationLists } from "~/utils/navigations";

const Page = () => {
  const [lists] = useState(NavigationLists);
  const router = useRouter()
  const appStore = useAppStore()

  useEffect( () => {
    appStore.setIsFetching(false)
  },[])

  const handleOpenPage = (title: string) => {
    router.push(`/client/ui?page=${title}`)
  }
  return (
    <div className="sm:p-5">
      <div className="flex flex-wrap text-gray-100">
        {lists.map((list, i) => {
          if (i !== 0)
            return (
              <div
                className="3xl:w-1/6 relative flex h-[50rem] w-full items-center justify-center overflow-hidden bg-gray-500 hover:border-2 hover:shadow-lg sm:h-[34rem] md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 [&_*]:cursor-pointer"
                key={list.title}
                onClick={() => handleOpenPage(list.title)}
              >
                <Image
                  src={list.image!}
                  alt="list.title"
                  fill={true}
                  className="object-cover"
                />
                <Label className="z-10 rounded-full bg-gray-900 px-5 py-1 text-2xl capitalize tracking-widest shadow-md">
                  {list.title}
                </Label>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Page;
