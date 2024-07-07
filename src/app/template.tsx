"use client";
import React, { useEffect, type ReactNode } from "react";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";
import { ToastTypes } from "~/utils/types";

const Template = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { toastType, passcode, setPasscode, setPasscodeModal } = useAppStore(
    (state) => ({
      toastType: state.toastType,
      passcode: state.passcode,
      setPasscode: state.setPasscode,
      setPasscodeModal: state.setPasscodeModal,
    }),
  );

  useEffect(() => {
    if (toastType == ToastTypes.DEFAULT) return;
    showToast(toastType);
  }, [toastType]);

  useEffect(() => {
    const tmpPasscode = localStorage.getItem("passcode");
    if (!tmpPasscode) return setPasscode('')
    if (tmpPasscode == process.env.NEXT_PUBLIC_PASSCODE) {
      setPasscode(tmpPasscode)
      localStorage.setItem('passcode', tmpPasscode)
    } else {
      setPasscode('')
    }
  }, []);

  useEffect( () => {
    if (passcode) setPasscodeModal(false)
    else setPasscodeModal(true)
  },[passcode])

  const showToast = (type: ToastTypes) => {
    const toastData = {
      title: "",
      description: "",
    };
    switch (type) {
      case ToastTypes.ADDED:
        toastData.title = "Added";
        toastData.description = "Record has been added successfully.";
        break;
      case ToastTypes.UPDATED:
        toastData.title = "Updated";
        toastData.description = "Record has been updated successfully.";
        break;
      case ToastTypes.DELETED:
        toastData.title = "Deleted";
        toastData.description = "Record has been deleted successfully.";
        break;
      // default:
      //   toastData.title = 'Title'
      //   toastData.description = 'Title description.'
      //   break;
    }
    toast({
      variant:
        toastType == ToastTypes.ADDED
          ? "success"
          : toastType == ToastTypes.DELETED
            ? "destructive"
            : "default",
      title: toastData.title,
      description: toastData.description,
      // action: (
      //   <ToastAction onClick={() => null} altText="">
      //     Close
      //   </ToastAction>
      // ),
    });
  };
  return <div>{children}</div>;
};

export default Template;
