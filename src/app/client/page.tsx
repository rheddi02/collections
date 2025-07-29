"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAppStore from "~/store/app.store";
import { NavigationLists } from "~/utils/navigations";
import { useMemo } from "react";

const Page = () => {
  const lists = useMemo(() => NavigationLists, []);
  const router = useRouter();
  const appStore = useAppStore();

  useEffect(() => {
    appStore.setIsFetching(false);
  }, []);

  const handleOpenPage = (title: string) => {
    router.push(`/client/ui?page=${title}`);
  };
  return (
    <div className="sm:p-5">
      <div className="flex flex-wrap text-gray-100">
        {lists.map((list, i) => {
          if (i !== 0)
            return (
              <div
                className="relative flex h-[30rem] w-full items-end justify-center overflow-hidden bg-gray-500 sm:h-[20rem] md:w-1/3 lg:w-1/4 xl:w-1/6 2xl:w-1/8 3xl:w-1/10 [&_*]:cursor-pointer group"
                key={list.title}
                onClick={() => handleOpenPage(list.title)}
              >
                <Image
                  src={list.image!}
                  alt="list.title"
                  fill={true}
                  className="object-cover"
                />
                <div
                  className="z-10 hidden group-hover:flex group-hover:h-1/3 w-full bg-gradient-to-t from-gray-900/95 via-gray-700/80 to-gray-800/0 items-center justify-center"
                >
                  <span className="text-white text-lg font-semibold drop-shadow uppercase">{list.title}</span>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Page;
