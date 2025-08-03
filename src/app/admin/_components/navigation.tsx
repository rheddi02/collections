"use client";
import {
  ArrowTopRightIcon,
  PinLeftIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import usePaginationStore from "~/store/pagination.store";
import type { NavigationType } from "~/utils/types";
import { signOut } from "next-auth/react";
import { useNavigationLists } from "~/utils/navigations";
import { Fragment } from "react";
import CategoryForm from "./category/page";

export default function Navigation() {
  const navList = useNavigationLists(); // Now reactive to category changes
  const handleReload = async (segment: string | undefined) => {};

  return (
    <div className="flex h-screen flex-col gap-2">
      <Nav {...{ navList, handleReload }} />
    </div>
  );
}

const Nav = ({
  navList,
  isChild = false,
  handleReload,
}: {
  navList: NavigationType[];
  isChild?: boolean;
  handleReload?: (segment: string | undefined) => Promise<void>;
}) => {
  const { openMenu, isLoading, setData } = useAppStore((state) => ({
    openMenu: state.openMenu,
    isLoading: state.isLoading,
    setData: state.setData,
  }));
  const router = useRouter();
  const segments = useSelectedLayoutSegments();
  const segment = segments.pop();

  const handleRoute = (route: NavigationType) => {
    setData([]);
    if (route.subRoute.length) {
      router.push(route.subRoute[0]!.route);
    } else {
      router.push(route.route);
    }
  };

  const handleReloadSegment = async () => {
    if (handleReload) await handleReload(segment);
  };

  const logout = () => {
    signOut({ callbackUrl: "/client" });
  };

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col gap-2",
        openMenu ? "w-40" : "hidden",
      )}
    >
      <div
        className={twMerge(
          "flex items-center justify-between rounded-md p-2 capitalize hover:cursor-pointer hover:bg-gray-400 hover:text-gray-800",
          "bg-gray-300 font-semibold text-gray-800",
        )}
        onClick={() => {
          router.push("/client");
        }}
      >
        Client Page
        <ArrowTopRightIcon />
      </div>
      {navList.map((navigation) => (
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
            <Nav navList={navigation.subRoute} isChild={true} />
          )}
        </Fragment>
      ))}
      <CategoryForm />
      <div
        className={twMerge(
          "group flex items-center gap-2 rounded-md p-2 capitalize hover:cursor-pointer",
          "bg-gray-300 font-semibold text-gray-800",
          "absolute bottom-5 w-full cursor-pointer",
        )}
        onClick={logout}
      >
        <PinLeftIcon />
        <Label className="select-none group-hover:font-bold">Logout</Label>
      </div>
    </div>
  );
};
