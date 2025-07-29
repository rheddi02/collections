"use client";
import React, { useEffect, type ReactNode } from "react";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";
import { ToastTypes } from "~/utils/types";
import { api } from "~/trpc/react";

const Template = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const { toastType, setData, setIsAuth } = useAppStore(
    (state) => ({
      toastType: state.toastType,
      setData: state.setData,
      setIsAuth: state.setIsAuth,
    }),
  );

  // Verify token on app load
  const tokenVerifyQuery = api.auth.verifyToken.useQuery(
    { token: typeof window !== "undefined" ? localStorage.getItem("authToken") ?? "" : "" },
    { 
      enabled: typeof window !== "undefined" && !!localStorage.getItem("authToken"),
      retry: false,
    }
  );

  useEffect(() => {
    if (toastType == ToastTypes.DEFAULT) return;
    showToast(toastType);
  }, [toastType]);

  useEffect(() => {
    setData([])
    
    // Check for existing auth token first
    const authToken = localStorage.getItem("authToken");
    if (authToken && tokenVerifyQuery.data?.valid) {
      setIsAuth(true);
      return;
    }
  }, [tokenVerifyQuery.data]);

  // Handle token verification errors
  useEffect(() => {
    if (tokenVerifyQuery.error) {
      // Token is invalid, clear it
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setIsAuth(false);
    }
  }, [tokenVerifyQuery.error]);

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
