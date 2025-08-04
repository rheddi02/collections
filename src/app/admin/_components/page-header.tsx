import { HamburgerMenuIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import React from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Props = {
  title: string;
  action: () => void;
  setOpenMenu: () => void;
  isFetching: boolean;
  label: string;
  reload: () => void
};

const PageHeader = ({
  title,
  label,
  action,
  setOpenMenu,
  isFetching,
  reload
}: Props) => {
  return (
    <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span onClick={setOpenMenu}>
          <HamburgerMenuIcon className="block h-5 w-5 sm:hidden" />
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl capitalize">{title}</span>
          <ReloadIcon onClick={reload} className={cn(isFetching && "animate-spin", 'cursor-pointer hover:bg-gray-900 rounded-full hover:text-white')} />
        </div>
      </div>
      <Button onClick={action} className="flex gap-2">
        <PlusIcon className="h-4 w-4" />
        {label}
      </Button>
    </div>
  );
};

export default PageHeader;
