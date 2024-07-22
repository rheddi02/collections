"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";

import React, { useEffect, useRef, useState } from "react";
import { DialogTitle } from "@radix-ui/react-dialog";

type Props = {
  action: (url: string) => void;
  setShow: (show: boolean) => void;
  show: boolean
  isLoading: boolean
};

const MeDialog = ({ isLoading, show, setShow, action }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAction = () => {
    if (inputRef?.current?.value.trim()) action(inputRef.current.value)
  }

  return (
    <Dialog onOpenChange={setShow} open={show}>
      <DialogContent className="w-5/6 sm:max-w-[425px]" >
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
        <div className="grid gap-4 py-4 mt-5">
          <div className="grid gap-2">
            <Input
              ref={inputRef}
              placeholder="Enter url here"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={handleAction}
            className="flex items-center gap-2"
          >
            {isLoading && <ReloadIcon className="animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeDialog;
