"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import useAppStore from "~/store/app.store";

const Passcode = () => {
  const passcodeRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setPasscodeModal, passcodeModal, setPasscode } = useAppStore((state) => ({
    setPasscodeModal: state.setPasscodeModal,
    passcodeModal: state.passcodeModal,
    setPasscode: state.setPasscode,
  }));

  const handlePasscode = () => {
    setIsLoading(true);
    if (
      passcodeRef?.current &&
      passcodeRef.current.value == process.env.NEXT_PUBLIC_PASSCODE
    ) {
      localStorage.setItem("passcode", passcodeRef.current.value);
      setPasscode(passcodeRef.current.value)
      setPasscodeModal(false);
    }
    setIsLoading(false);
  };
  return (
    <Dialog open={passcodeModal}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton={true}>
        <DialogHeader className="text-left">
          <DialogTitle>Enter passcode</DialogTitle>
          <DialogDescription>
            A passcode is required to use the application
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="passcode"
              placeholder="Enter passcode to gain access"
              ref={passcodeRef}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            onClick={handlePasscode}
            className="flex items-center gap-2"
          >
            {isLoading && <ReloadIcon className="animate-spin" />}
            Enter Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Passcode;
