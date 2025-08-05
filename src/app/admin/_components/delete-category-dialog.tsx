"use client";

import { useRouter } from "next/navigation";
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
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { type NavigationType } from "~/utils/types";

interface DeleteCategoryDialogProps {
  category: NavigationType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteCategoryDialog({
  category,
  isOpen,
  onClose,
}: DeleteCategoryDialogProps) {
  const utils = api.useUtils();
  const router = useRouter()

  const { mutate: DeleteCategoryMutation, isPending: isDeleting } = api.delete.category.useMutation({
    onSuccess: async () => {
      await utils.list.categories.invalidate();
      toast({
        title: "Success",
        description: "Category and associated links deleted successfully",
      });
      // onClose();
      router.push('/admin/dashboard')
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const confirmDelete = () => {
    if (category?.id) {
      DeleteCategoryMutation(category.id);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the category "{category?.title}"?
            <br />
            <span className="mt-2 block font-semibold text-red-600">
              This will also delete all links associated with this category.
            </span>
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Category"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
