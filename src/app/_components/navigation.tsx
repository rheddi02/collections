"use client";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import { NavigationLists } from "~/utils/navigations";
import type { NavigationType } from "~/utils/types";

const Navigation = () => {
  const [navList] = useState(NavigationLists);

  return (
    <div className="flex h-screen flex-col gap-2">
      <Nav {...{ navList }} />
    </div>
  );
};

export default Navigation;

const Nav = ({
  navList,
  isChild = false,
}: {
  navList: NavigationType[];
  isChild?: boolean;
}) => {
  const { openMenu } = useAppStore(state => ({openMenu: state.openMenu}))
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();

  const handleRoute = (route: NavigationType) => {
    if (route.subRoute.length) {
      localStorage.setItem("route", JSON.stringify(route.subRoute[0]));
      router.push(route.subRoute[0]!.route);
    } else {
      localStorage.setItem("route", JSON.stringify(route));
      router.push(route.route);
    }
  };

  return (
    <div className={cn("flex h-screen flex-col gap-2", openMenu ? 'w-64' : 'hidden')}>
      {navList.map((navigation) => (
        <React.Fragment key={navigation.route}>
          <div
            className={twMerge(
              "flex items-center rounded-md p-2 capitalize hover:cursor-pointer hover:bg-gray-300 hover:text-gray-800",
              navigation.route.includes(segment!) &&
                !navigation.subRoute.length &&
                "bg-gray-300 font-semibold text-gray-800",
              isChild && "pl-8",
            )}
            onClick={() => handleRoute(navigation)}
          >
            {navigation.title}
          </div>
          {!!navigation.subRoute.length && (
            <Nav navList={navigation.subRoute} isChild={true} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
