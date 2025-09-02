"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import useAppStore from "~/store/app.store";

// Global confirmation dialog that's managed through the app store
export function GlobalConfirmDialog() {
  const { confirmDialog, closeConfirmDialog, setConfirmDialog } = useAppStore((state) => ({
    confirmDialog: state.confirmDialog,
    closeConfirmDialog: state.closeConfirmDialog,
    setConfirmDialog: state.setConfirmDialog,
  }));

  if (!confirmDialog) return null;

  const handleConfirm = async () => {
    // Prevent multiple clicks
    if (confirmDialog.isLoading) return;
    
    try {
      // Set loading state
      setConfirmDialog({
        ...confirmDialog,
        isLoading: true,
      });
      
      // Execute the confirmation callback
      await confirmDialog.onConfirm();
      
      // Close the dialog after successful execution
      closeConfirmDialog();
    } catch (error) {
      // Reset loading state if there's an error, but keep dialog open
      setConfirmDialog({
        ...confirmDialog,
        isLoading: false,
      });
      // Don't close dialog on error so user can see the error message
    }
  };

  const handleCancel = () => {
    // Don't allow cancel during loading
    if (confirmDialog.isLoading) return;
    closeConfirmDialog();
  };

  return (
    <AlertDialog 
      open={confirmDialog.isOpen} 
      onOpenChange={(open) => {
        // Prevent closing while an operation is in progress
        if (!open && !confirmDialog.isLoading) closeConfirmDialog();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmDialog.description}
            {confirmDialog.warningText && (
              <div className="mt-2 font-medium text-red-600">
                {confirmDialog.warningText}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={confirmDialog.isLoading}
          >
            {confirmDialog.cancelText}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={confirmDialog.isLoading}
            className={
              confirmDialog.variant === 'destructive'
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {confirmDialog.isLoading ? "Processing..." : confirmDialog.confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
