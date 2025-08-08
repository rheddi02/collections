"use client";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import { type NavigationType } from "~/utils/types";
import { useNavigationLists } from "~/hooks/useNavigationLists";
import { Fragment, useEffect } from "react";
import UserProfile from "./user-profile";
import { isMobile } from "react-device-detect";

export default function Navigation() {
  const navLists = useNavigationLists(); // Now reactive to category changes
  const { openMenu, setOpenMenu } = useAppStore((state) => ({
    openMenu: state.openMenu,
    setOpenMenu: state.setOpenMenu,
  }));

  useEffect( ()=> {
    setOpenMenu(!isMobile);
  },[isMobile])

  return (
    <nav className={cn(openMenu ? "w-72" : "hidden")}>
      <div className="flex h-screen w-full flex-col gap-2 p-2">
        <UserProfile />
        <div className="custom-scrollbar h-auto flex-1 overflow-y-auto overscroll-none">
          <Nav navLists={navLists} />
        </div>
      </div>
    </nav>
  );
}

const Nav = ({
  navLists,
  isChild = false,
}: {
  navLists: NavigationType[];
  isChild?: boolean;
}) => {
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();

  const handleRoute = (route: NavigationType) => {
    if (route.subRoute.length) {
      router.push(route.subRoute[0]!.route);
    } else {
      router.push(route.route);
      if (isMobile) {
        // Close the menu on mobile after navigation
        useAppStore.getState().setOpenMenu(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2",
      )}
    >
      {navLists.map((navigation) => (
        <Fragment key={navigation.route}>
          <div
            className={twMerge(
              "group flex items-center justify-between rounded-md p-2 capitalize hover:cursor-pointer hover:bg-gray-400 hover:text-gray-800",
              segment === navigation.title.toLowerCase().replaceAll(" ", "-") &&
                !navigation.subRoute.length &&
                "bg-gray-300 font-semibold text-gray-800",
              isChild && "pl-8",
            )}
            onClick={() => handleRoute(navigation)}
          >
            <Label className="select-none">{navigation.title}</Label>
          </div>
          {!!navigation.subRoute.length && (
            <Nav navLists={navigation.subRoute} isChild={true} />
          )}
        </Fragment>
      ))}
    </div>
  );
};
