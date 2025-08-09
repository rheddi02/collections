import { HamburgerMenuIcon, ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
import { cn } from "~/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  setOpenMenu: () => void;
  isFetching: boolean;
  reload: () => void;
};

const PageHeader = ({
  title,
  subtitle,
  isFetching,
  setOpenMenu,
  reload,
}: Props) => {
  return (
    <div className="flex items-center gap-2">
      <span onClick={setOpenMenu}>
        <HamburgerMenuIcon className="block h-5 w-5 sm:hidden" />
      </span>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl capitalize">{title}</span>
          <ReloadIcon
            onClick={reload}
            className={cn(
              isFetching && "animate-spin",
              "cursor-pointer rounded-full hover:bg-gray-900 hover:text-white",
            )}
          />
        </div>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
    </div>
  );
};

export default PageHeader;
