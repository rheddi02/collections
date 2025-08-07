"use client";

import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";
import { createCategoryColumns } from "./_components/create-category-columns";
import type { categoryOutput } from "~/server/api/client/types";
import { useRouter } from "next/navigation";
import PageTable from "../_components/table/page-table";
import { useConfirmDialog } from "~/hooks/useConfirmDialog";
import PageHeader from "../_components/page-header";
import CreateCategoryPopover from "./_components/create-category-popover";
import EditCategoryPopover from "./_components/edit-category-popover";
import { useState, useEffect } from "react";
import { useApiUtils } from "~/hooks/useApiUtils";
import { Button } from "~/components/ui/button";
import { ToastTypes } from "~/utils/types";

const CategoryManagementPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { confirm } = useConfirmDialog();
  const [selectedCategories, setSelectedCategories] = useState<
    categoryOutput[]
  >([]);

  const {
    setEditCategory,
    setDeleteId,
    removeDeleteId,
    page,
    perPage,
    setPageCount,
    setToastType
  } = useAppStore((state) => ({
    setEditCategory: state.setEditCategory,
    setDeleteId: state.setDeleteId,
    removeDeleteId: state.removeDeleteId,
    page: state.page,
    perPage: state.perPage,
    setPageCount: state.setPageCount,
    setToastType: state.setToastType
  }));

  const {
    data: categories,
    isLoading,
    isFetching,
    refetch,
  } = api.list.categories.useQuery({ page, perPage });
  const utils = useApiUtils();

  const deleteIdState = useAppStore((state) => state.deleteId);

  // Update page count when categories data changes
  useEffect(() => {
    if (categories && !Array.isArray(categories) && categories.totalPages) {
      setPageCount(categories.totalPages);
    }
  }, [categories, setPageCount]);

  const deleteCategoryMutation = api.delete.category.useMutation({
    onSuccess: async () => {
      setToastType({ type: ToastTypes.DELETED });
      // Refetch categories
      await utils.list.categories.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEdit = (category: categoryOutput) => {
    setEditCategory(category);
  };

  const handleDeleteMultipe = async () => {
    confirm({
      title: "Delete Categories",
      description: `Are you sure you want to delete the selected categories? This action cannot be undone and will also delete all links associated with these categories.`,
      warningText:
        "This will permanently delete the categories and all associated links.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
            setDeleteId(selectedCategories.map(cat => cat.id));
            await deleteCategoryMutation.mutateAsync(selectedCategories.map(cat => cat.id));
            setSelectedCategories([]);
        } catch (error) {
          console.error("Error deleting categories:", error);
        }
      },
    });
  };

  const handleDelete = (category: categoryOutput) => {
    // Clear all selected categories when deleting any category
    setSelectedCategories([]);
    
    confirm({
      title: "Delete Category",
      description: `Are you sure you want to delete the category "${category.title}"? This action cannot be undone and will also delete all links associated with this category.`,
      warningText:
        "This will permanently delete the category and all associated links.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        setDeleteId(category.id);
        try {
          await deleteCategoryMutation.mutateAsync([category.id]);
        } finally {
          removeDeleteId(category.id);
        }
      },
    });
  };

  const handleView = (category: categoryOutput) => {
    router.push(`/admin/${category.title.toLowerCase().replace(/\s+/g, "-")}`);
  };

  const handleRowSelectionChange = (selectedRows: categoryOutput[]) => {
    setSelectedCategories(selectedRows);
  };

  // Create columns for the category table (after handlers are defined)
  const columns = createCategoryColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    deletingIds: deleteIdState,
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-5 flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Category Management"
          subtitle="Manage your collection categories"
          isFetching={isFetching}
          setOpenMenu={() => useAppStore.getState().setOpenMenu(true)}
          reload={refetch}
        />
        <div className="flex gap-2">
          {!!selectedCategories.length && (
            <Button variant={"destructive"} onClick={handleDeleteMultipe}>
              Delete ({selectedCategories.length})
            </Button>
          )}
          <CreateCategoryPopover />
        </div>
      </div>
      <PageTable
        data={Array.isArray(categories) ? categories : categories?.data || []}
        columns={columns}
        loading={isLoading}
        onRowChange={handleRowSelectionChange}
        selectedRows={selectedCategories}
      />

      {selectedCategories.length > 0 && (
        <div className="mt-4 rounded-lg border bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            Selected {selectedCategories.length} categor
            {selectedCategories.length === 1 ? "y" : "ies"}:
            <span className="ml-2 font-medium">
              {selectedCategories.map((cat) => cat.title).join(", ")}
            </span>
          </p>
        </div>
      )}
      <EditCategoryPopover />
    </div>
  );
};

export default CategoryManagementPage;
