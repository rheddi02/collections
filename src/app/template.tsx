"use client";
import React, { useEffect, type ReactNode } from "react";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";

const Template = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const toastData = useAppStore((state) => state.toastData);

  useEffect(() => {
    showToast(toastData);
  }, [toastData]);

  const showToast = ({
    title,
    description,
  }: {
    title: string;
    description?: string;
  }) => {
    toast({
      title: title ?? "Toast",
      description: description ?? "Toast description",
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
