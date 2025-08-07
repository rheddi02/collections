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
import { useState, useEffect } from "react";
import { useApiUtils } from "~/hooks/useApiUtils";

const CategoryManagementPage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { confirm } = useConfirmDialog();
  const [selectedCategories, setSelectedCategories] = useState<categoryOutput[]>([]);
  
  const { 
    setEditCategory, 
    setDeleteId, 
    removeDeleteId, 
    page, 
    perPage,
    setPageCount
  } = useAppStore((state) => ({
    setEditCategory: state.setEditCategory,
    setDeleteId: state.setDeleteId,
    removeDeleteId: state.removeDeleteId,
    page: state.page,
    perPage: state.perPage,
    setPageCount: state.setPageCount,
  }));

  const { data: categories, isLoading, isFetching, refetch } = api.list.categories.useQuery({ page, perPage });
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
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
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

  const handleDelete = (category: categoryOutput) => {
    confirm({
      title: "Delete Category",
      description: `Are you sure you want to delete the category "${category.title}"? This action cannot be undone and will also delete all links associated with this category.`,
      warningText: "This will permanently delete the category and all associated links.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        setDeleteId(category.id);
        try {
          await deleteCategoryMutation.mutateAsync(category.id);
        } finally {
          removeDeleteId(category.id);
        }
      },
    });
  };

  const handleView = (category: categoryOutput) => {
    router.push(`/admin/${category.title.toLowerCase().replace(/\s+/g, '-')}`);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between mb-5">
        <PageHeader
          title="Category Management"
          subtitle="Manage your collection categories"
          isFetching={isFetching}
          setOpenMenu={() => useAppStore.getState().setOpenMenu(true)}
          reload={refetch}
        />
        <CreateCategoryPopover />
      </div>
      <PageTable 
        data={Array.isArray(categories) ? categories : (categories?.data || [])} 
        columns={columns}
        loading={isLoading}
        onRowChange={handleRowSelectionChange}
      />

      {selectedCategories.length > 0 && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border">
          <p className="text-sm text-gray-700">
            Selected {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'}:
            <span className="ml-2 font-medium">
              {selectedCategories.map(cat => cat.title).join(', ')}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;
