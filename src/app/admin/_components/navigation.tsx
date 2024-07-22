"use client";
import { ArrowTopRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import usePaginationStore from "~/store/pagination.store";
import { api } from "~/trpc/react";
import { NavigationLists } from "~/utils/navigations";
import type { NavigationType } from "~/utils/types";

export default function Navigation() {
  const [navList] = useState<NavigationType[]>(NavigationLists);

  const { page, perPage } = usePaginationStore((state) => ({
    perPage: state.perPage,
    page: state.page,
  }));
  const { refetch: fetchHome } = api.list.homeTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchBeauty } = api.list.beautyTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchHealth } = api.list.healthTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchEquipment } = api.list.equipmentTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchEnergy } = api.list.energyTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchLeisure } = api.list.leisureTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchRide } = api.list.rideTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchMachinery } = api.list.machineryTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchPlant } = api.list.plantTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchCloth } = api.list.clothTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchPet } = api.list.petTip.useQuery(
    { page, perPage },
    { enabled: false },
  );
  const { refetch: fetchFood } = api.list.foodTip.useQuery(
    { page, perPage },
    { enabled: false },
  );

  const handleReload = async (segment: string | undefined) => {
    if (segment?.includes("home")) await fetchHome();
    if (segment?.includes("beauty")) await fetchBeauty();
    if (segment?.includes("health")) await fetchHealth();
    if (segment?.includes("food")) await fetchFood();
    if (segment?.includes("pet")) await fetchPet();
    if (segment?.includes("cloth")) await fetchCloth();
    if (segment?.includes("plant")) await fetchPlant();
    if (segment?.includes("machinery")) await fetchMachinery();
    if (segment?.includes("ride")) await fetchRide();
    if (segment?.includes("leisure")) await fetchLeisure();
    if (segment?.includes("energy")) await fetchEnergy();
    if (segment?.includes("equipment")) await fetchEquipment();
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
        openMenu ? "w-40" : "hidden",
      )}
    >
      <div
        className={twMerge(
          "flex items-center justify-between rounded-md p-2 capitalize hover:cursor-pointer hover:bg-gray-400 hover:text-gray-800",
          "bg-gray-300 font-semibold text-gray-800",
          
        )}
        onClick={() => {
          localStorage.removeItem('passcode')
          router.push("/client")
        }}
      >
        Client Page
        <ArrowTopRightIcon />
      </div>
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
            <Label className="select-none">{navigation.title}</Label>
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
