import useAppStore from "~/store/app.store";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  warningText?: string;
  onConfirm: () => void | Promise<void>;
}

export function useConfirmDialog() {
  const setConfirmDialog = useAppStore((state) => state.setConfirmDialog);

  const confirm = (options: ConfirmOptions) => {
    if (typeof setConfirmDialog !== 'function') {
      console.warn('setConfirmDialog is not available');
      return;
    }
    
    try {
      setConfirmDialog({
        isOpen: true,
        title: options.title,
        description: options.description,
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        variant: options.variant || "default",
        warningText: options.warningText,
        isLoading: false,
        onConfirm: options.onConfirm,
      });
    } catch (error) {
      console.error('Error setting confirm dialog:', error);
    }
  };

  return { confirm };
}
