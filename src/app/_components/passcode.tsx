"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
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
  const router = useRouter()
  const passcodeRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setPasscodeModal, passcodeModal, setPasscode, setIsMe } = useAppStore((state) => ({
    setPasscodeModal: state.setPasscodeModal,
    passcodeModal: state.passcodeModal,
    setPasscode: state.setPasscode,
    setIsMe: state.setIsMe,
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
      router.push('/admin/dashboard')
    }
    if (
      passcodeRef?.current &&
      passcodeRef.current.value == process.env.NEXT_PUBLIC_PASSCODE_PRIVATE
    ) {
      setIsMe(true)
      router.push('/me')
    }
    setIsLoading(false);
  };

  const handlePasscodeClose = () => {
    setPasscodeModal(false)
  }
  return (
    <Dialog open={passcodeModal}>
      <DialogContent className="w-2/3 sm:max-w-[425px]" hideCloseButton={true}>
        <DialogHeader className="text-left">
          <DialogTitle>Passcode</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="passcode"
              type="password"
              placeholder="Enter passcode to grant access"
              ref={passcodeRef}
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:gap-1">
          <Button
            disabled={isLoading}
            onClick={handlePasscodeClose}
            className="flex items-center gap-2"
            variant={'secondary'}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            onClick={handlePasscode}
            className="flex items-center gap-2"
          >
            {isLoading && <ReloadIcon className="animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Passcode;
