import { PlusIcon } from "@radix-ui/react-icons";
import { debounce } from "lodash";
import React, { ChangeEvent } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useAppStore, { State } from "~/store/app.store";

const Actions = () => {
  const appStore = useAppStore((state) => ({
    setModal: state.setModal,
    setFilters: state.setFilters,
    filters: state.filters,
  }));

  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    appStore.setFilters({ ...appStore.filters, search: e.target.value });
  }, 500);

  return (
    <div className="flex gap-2">
      <Input className="w-96" placeholder="Search" onChange={handleSearch} />
      <Button onClick={() => appStore.setModal(true)} className="flex gap-2">
        <PlusIcon className="h-4 w-4" />
        Add New
      </Button>
    </div>
  );
};

export default Actions;
