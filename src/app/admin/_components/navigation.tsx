"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import type { NavigationType } from "~/utils/types";
import { useNavigationLists } from "~/utils/navigations";
import { Fragment } from "react";
import CategoryForm from "./category-form";
import LogoutBtn from "./logout-btn";
import UserProfile from "./user-profile";

export default function Navigation() {
  const navLists = useNavigationLists(); // Now reactive to category changes
  const handleReload = async (segment: string | undefined) => {};

  return (
    <div className="flex h-screen w-72 flex-col gap-2">
      <Nav {...{ navLists, handleReload }} />
    </div>
  );
}

const Nav = ({
  navLists,
  isChild = false,
  handleReload,
}: {
  navLists: NavigationType[];
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
        "relative flex h-screen flex-col gap-2",
        openMenu ? "w-full" : "hidden",
      )}
    >
      <UserProfile />
      {navLists.map((navigation) => (
        <Fragment key={navigation.route}>
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
            <Nav navLists={navigation.subRoute} isChild={true} />
          )}
        </Fragment>
      ))}
      <div className="mt-auto flex flex-col gap-2 pb-5">
        <CategoryForm />
        <LogoutBtn />
      </div>
    </div>
  );
};
