"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
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

const DeleteCode = () => {
  const deleteCodeRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const { setDeleteCodeModal, deleteCodeModal, setDeleteCode } = useAppStore(
    (state) => ({
      setDeleteCodeModal: state.setDeleteCodeModal,
      deleteCodeModal: state.deleteCodeModal,
      setDeleteCode: state.setDeleteCode,
    }),
  );

  useEffect( () => {
    if (deleteCodeRef.current) deleteCodeRef.current.value = ''
  },[deleteCodeModal])

  const handleDeleteCode = () => {
    if (!deleteCodeRef?.current?.value) return
    setIsLoading(true);
    if (
      deleteCodeRef?.current &&
      deleteCodeRef.current.value == process.env.NEXT_PUBLIC_DELETE_CODE
    ) {
      setDeleteCode(true);
      setDeleteCodeModal(false);
      setFailed(false);
  } else {
      setDeleteCode(false);
      setFailed(true);
    }
    setIsLoading(false);
  };

  const handleDeleteClose = () => {
    setDeleteCodeModal(false)
    setFailed(false);
  }
  return (
    <Dialog open={deleteCodeModal} onOpenChange={setDeleteCodeModal}>
      <DialogContent className="sm:max-w-[425px]">
        {failed ? (
          <>
            <DialogHeader className="text-left">
              <DialogTitle>Permission Denied</DialogTitle>
              <DialogDescription>A delete code is incorrect.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                You are not allowed to delete this record.
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleDeleteClose}  className="flex items-center gap-2">
                Close
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle>Enter delete code</DialogTitle>
              <DialogDescription>
                A delete code is required for security purposes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Input
                  id="deletecode"
                  placeholder="Enter delete code to continue"
                  ref={deleteCodeRef}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={isLoading}
                onClick={handleDeleteCode}
                className="flex items-center gap-2"
              >
                {isLoading && <ReloadIcon className="animate-spin" />}
                Enter Code
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCode;
