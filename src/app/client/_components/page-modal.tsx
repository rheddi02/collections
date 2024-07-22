"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import useAppStore from "~/store/app.store";

const PageModal = () => {
  const isFetching = useAppStore( state => state.isFetching)
  return (
    <Dialog open={isFetching} >
      <DialogContent className="sm:max-w-[425px] w-1/2" hideCloseButton>
        <DialogHeader className="flex items-center justify-center">
          <DialogTitle className="flex gap-2 items-center">
            <ReloadIcon className="animate-spin"/>
            Data fetching</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PageModal;
