"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface DialogConfig {
  title: string;
  description?: string;
  children?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  onConfirm: () => void;
  onCancel?: () => void;
  hideFooter?: boolean;
}

interface GlobalDialogContextType {
  showDialog: (config: DialogConfig) => void;
  hideDialog: () => void;
}

const GlobalDialogContext = createContext<GlobalDialogContextType | undefined>(
  undefined,
);

export const useGlobalDialog = () => {
  const context = useContext(GlobalDialogContext);
  if (!context) {
    throw new Error(
      "useGlobalDialog must be used within a GlobalDialogProvider",
    );
  }
  return context;
};

interface GlobalDialogProviderProps {
  children: ReactNode;
}

export const GlobalDialogProvider: React.FC<GlobalDialogProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const showDialog = (dialogConfig: DialogConfig) => {
    setConfig(dialogConfig);
    setIsOpen(true);
  };

  const hideDialog = () => {
    setIsOpen(false);
    setConfig(null);
  };

  const handleConfirm = () => {
    if (config?.onConfirm) {
      config.onConfirm();
    }
    hideDialog();
  };

  const handleCancel = () => {
    if (config?.onCancel) {
      config.onCancel();
    }
    hideDialog();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    }
  };

  return (
    <GlobalDialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{config?.title}</DialogTitle>
            {config?.description && (
              <DialogDescription>{config.description}</DialogDescription>
            )}
          </DialogHeader>

          {config?.children && <div className="py-4">{config.children}</div>}

          {!config?.hideFooter && (
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {config?.cancelText || "Cancel"}
              </Button>
              <Button
                variant={config?.variant || "destructive"}
                onClick={handleConfirm}
              >
                {config?.confirmText || "Confirm"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </GlobalDialogContext.Provider>
  );
};
