"use client";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import { type NavigationType } from "~/utils/types";
import { useNavigationLists } from "~/hooks/useNavigationLists";
import { Fragment, useEffect, useState } from "react";
import UserProfile from "./user-profile";
import { isMobile } from "react-device-detect";
import { useQueryClient } from "@tanstack/react-query";
import { ThemeToggle } from "~/components/theme-toggle";

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
    <nav className={cn(openMenu ? "w-72" : "hidden", "sm:w-72 sm:block")}> 
      <div className="flex h-screen w-full flex-col gap-2 p-2">
        <UserProfile />
        <div className="custom-scrollbar h-auto flex-1 overflow-y-auto overscroll-none">
          <Nav navLists={navLists} />
        </div>
          <ThemeToggle />
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
  const segment = segments[segments.length - 1];
  const queryClient = useQueryClient();

  const handleRoute = async (route: NavigationType) => {
    if (route.subRoute.length) {
      await queryClient.cancelQueries();
      router.push(route.subRoute[0]!.route);
    } else {
      await queryClient.cancelQueries();
      router.push(route.route);
      if (isMobile) {
        // Close the menu on mobile after navigation
        useAppStore.getState().setOpenMenu(false);
      }
    }
  };

  return (
    <div className={cn("relative flex flex-col gap-1")}>
      {navLists.map((navigation) => (
        <Fragment key={navigation.route}>
          <div
            className={twMerge(
              "group flex items-center justify-between rounded-md p-2 capitalize hover:cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted",
              (segments.includes(navigation.title.toLowerCase().replaceAll(" ", "-")) ||
                segment === navigation.title.toLowerCase().replaceAll(" ", "-")) &&
                !navigation.subRoute.length &&
                "bg-muted font-medium text-foreground",
              isChild && "pl-6",
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
