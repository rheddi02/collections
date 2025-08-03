"use client";
import React, { useEffect, type ReactNode } from "react";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";
import { ToastTypes } from "~/utils/types";

const Template = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { toastType } = useAppStore(
    (state) => ({
      toastType: state.toastType,
    }),
  );

  useEffect(() => {
    if (toastType.type == ToastTypes.DEFAULT) return;
    showToast(toastType);
  }, [toastType]);

  const showToast = (toastType: { type: ToastTypes; data?: string }) => {
    const toastData = {
      title: "",
      description: "",
    };
    switch (toastType.type) {
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
      case ToastTypes.ERROR:
        toastData.title = 'Error'
        toastData.description = toastType.data || "An error occurred.";
        break;
    }
    toast({
      variant:
        toastType.type == ToastTypes.ADDED
          ? "success"
          : toastType.type == ToastTypes.ERROR
            ? "destructive"
            : toastType.type == ToastTypes.DELETED
              ? "info"
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
