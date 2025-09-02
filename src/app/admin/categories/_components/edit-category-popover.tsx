"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { api } from "~/trpc/react";
import TextInput from "../../_components/text-input";
import { categoryFormSchema, CategoryFormValues } from "~/utils/schemas";
import { useApiUtils } from "~/hooks";
import useAppStore from "~/store/app.store";
import { ToastTypes } from "~/utils/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";

const EditCategoryPopover = () => {
  const { editCategory, setEditCategory, setToastType } = useAppStore((state) => ({
    editCategory: state.editCategory,
    setEditCategory: state.setEditCategory,
    setToastType: state.setToastType,
  }));

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const utils = useApiUtils();

  const updateCategoryMutation = api.categories.update.useMutation({
    onSuccess: async () => {
      setToastType({ type: ToastTypes.UPDATED });
      setEditCategory(null);
      // Invalidate categories to refetch
      await utils.categories.invalidate();
      await utils.categories.listAll.invalidate();
    },
    onError: (error) => {
      // customize error message so users can easily understand
      if (error.data?.zodError) {
        const fieldErrors = error.data.zodError.fieldErrors;
        const issues = Object.values(fieldErrors)
          .flat()
          .filter(Boolean) as string[];
        setToastType({ type: ToastTypes.ERROR, data: issues.join("\n") });
      } else {
        setToastType({ type: ToastTypes.ERROR, data: error.message });
      }
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
    if (!editCategory) return;
    
    updateCategoryMutation.mutate({
      id: editCategory.id,
      title: data.title.trim(),
    });
  };

  const handleCancel = () => {
    form.reset();
    setEditCategory(null);
  };

  // Reset form when editCategory changes
  useEffect(() => {
    if (editCategory) {
      form.reset({
        title: editCategory.title,
      });
    }
  }, [editCategory, form]);

  // Reset form when dialog opens to an editCategory
  useEffect(() => {
    if (editCategory) {
      form.reset({ title: editCategory.title });
    }
  }, [editCategory, form]);

  const handleOpenChange = (open: boolean) => {
    // Prevent closing dialog while mutation is in progress
    if (!open && updateCategoryMutation.isPending) {
      return;
    }
    
    if (!open) {
      setEditCategory(null);
    }
  };

  return (
    <Dialog open={!!editCategory} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-col gap-2 bg-gray-900 rounded p-2">
                <p className="text-xs text-gray-100">
                  Category name can only contain letters, numbers, spaces, hyphens (-), and periods (.)
                </p>
              </div>
            </div>
            <div className="w-full">
              <TextInput
                name="title"
                placeholder="Enter category name"
                disabled={updateCategoryMutation.isPending}
                className="border-muted-500 focus:border-muted-700 w-full border focus:ring-2 focus:ring-green-200"
                autoFocus
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={updateCategoryMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={updateCategoryMutation.isPending || !form.watch("title")?.trim()}
              >
                {updateCategoryMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryPopover;
