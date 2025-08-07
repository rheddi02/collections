"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
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
      onOpenChange={(open) => !open && closeConfirmDialog()}
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
          <AlertDialogCancel onClick={handleCancel} disabled={confirmDialog.isLoading}>
            {confirmDialog.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={confirmDialog.isLoading}
            className={
              confirmDialog.variant === 'destructive' 
                ? "bg-red-600 hover:bg-red-700" 
                : ""
            }
          >
            {confirmDialog.isLoading ? "Processing..." : confirmDialog.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
