"use client";
import React, { useEffect, type ReactNode } from "react";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";

const Template = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const toastType = useAppStore((state) => state.toastType);

  useEffect(() => {
    showToast(toastType);
  }, [toastType]);

  const showToast = (type: string) => {
    const toastData = {
      title: '',
      description: ''
    }
    switch (type) {
      case 'create':
        toastData.title = 'Added'
        toastData.description = 'Record has been added successfully.'
        break;
      case 'update':
        toastData.title = 'Updated'
        toastData.description = 'Record has been updated successfully.'
        break;
      case 'delete':
        toastData.title = 'Deleted'
        toastData.description = 'Record has been deleted successfully.'
        break;
      // default:
      //   toastData.title = 'Title'
      //   toastData.description = 'Title description.'
      //   break;
    }
    toast({
      title: toastData.title,
      description: toastData.description
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
