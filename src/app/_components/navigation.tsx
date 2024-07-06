"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import usePaginationStore from "~/store/pagination.store";
import { api } from "~/trpc/react";
import { NavigationLists } from "~/utils/navigations";
import type { NavigationType } from "~/utils/types";

export default function Navigation() {
  const [navList] = useState(NavigationLists);

  const { page, perPage } = usePaginationStore((state) => ({
    perPage: state.perPage,
    page: state.page,
  }));
  const { refetch: fetchHome } = api.home.get.useQuery({
    page,
    perPage,
  });
  const { refetch: fetchBeauty } = api.beauty.get.useQuery({
    page,
    perPage,
  });
  const { refetch: fetchHealth } = api.health.get.useQuery({
    page,
    perPage,
  });
  const { refetch: fetchEquipment } = api.equipment.get.useQuery({
    page,
    perPage,
  });
  const { refetch: fetchDashboard } = api.dashboard.get.useQuery();

  const handleReload = async (segment: string | undefined) => {
    if (segment == "dashboard") await fetchDashboard()
    if (segment == "home-tips") await fetchHome();
    if (segment == "beauty-tips") await fetchBeauty();
    if (segment == "health-tips") await fetchHealth();
    if (segment == "equipment-tips") await fetchEquipment();
  };

  return (
    <div className="flex h-screen flex-col gap-2">
      <Nav {...{ navList, handleReload }} />
    </div>
  );
}

// export default Navigation;

const Nav = ({
  navList,
  isChild = false,
  handleReload,
}: {
  navList: NavigationType[];
  isChild?: boolean;
  handleReload?: (segment: string | undefined) => Promise<void>;
}) => {
  const { openMenu, isLoading } = useAppStore((state) => ({
    openMenu: state.openMenu,
    isLoading: state.isLoading,
  }));
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();

  const handleRoute = (route: NavigationType) => {
    if (route.subRoute.length) {
      router.push(route.subRoute[0]!.route);
    } else {
      router.push(route.route);
    }
  };

  const handleReloadSegment = async () => {
    if (handleReload) await handleReload(segment);
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col gap-2",
        openMenu ? "w-64" : "hidden",
      )}
    >
      {navList.map((navigation) => (
        <React.Fragment key={navigation.route}>
          <div
            className={twMerge(
              "group flex items-center justify-between rounded-md p-2 capitalize hover:cursor-pointer hover:bg-gray-400 hover:text-gray-800",
              navigation.route.includes(segment!) &&
                !navigation.subRoute.length &&
                "bg-gray-300 font-semibold text-gray-800",
              isChild && "pl-8",
            )}
            onClick={() => handleRoute(navigation)}
          >
            {navigation.title}
            {segment == navigation.title.replaceAll(" ", "-") && (
              <ReloadIcon
                onClick={handleReloadSegment}
                className={cn(
                  isLoading && "animate-spin",
                  "text-gray-500 group-hover:text-gray-800",
                )}
              />
            )}
          </div>
          {!!navigation.subRoute.length && (
            <Nav navList={navigation.subRoute} isChild={true} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
