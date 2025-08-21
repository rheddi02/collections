"use client";

import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";
import useAppStore from "~/store/app.store";
import { createCategoryColumns } from "./_components/create-category-columns";
// import type { categoryListOutput, categoryOutput, categoryUpdateInput } from "~/server/api/client/types";
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
import { Row } from "@tanstack/react-table";
import { CreateCategoryValues, UpdateCategoryValues } from "~/utils/schemas";

const CategoryManagementPage = () => {
  // const { toast } = useToast();
  const router = useRouter();
  const { confirm } = useConfirmDialog();
  const [selectedCategories, setSelectedCategories] = useState<
    UpdateCategoryValues[]
  >([]);

  const {
    setEditCategory,
    setDeleteId,
    page,
    perPage,
    setPageCount,
    setToastType,
    setOpenMenu,
    openMenu,
  } = useAppStore((state) => ({
    setEditCategory: state.setEditCategory,
    setDeleteId: state.setDeleteId,
    page: state.page,
    perPage: state.perPage,
    setPageCount: state.setPageCount,
    setToastType: state.setToastType,
    setOpenMenu: state.setOpenMenu,
    openMenu: state.openMenu,
  }));

  const {
    data: categories,
    isLoading,
    isFetching,
    refetch,
  } = api.list.categories.useQuery({ page, perPage },{
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
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
      await utils.list.allCategories.invalidate();
    },
    onError: (error) => {
      // toast({
      //   title: "Error",
      //   description: error.message,
      //   variant: "destructive",
      // });
      setToastType({ type: ToastTypes.ERROR, data: error.message });
    },
  });

  const handleEdit = (category: UpdateCategoryValues) => {
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
          setDeleteId(selectedCategories.map((cat) => cat.id));
          await deleteCategoryMutation.mutateAsync(
            selectedCategories.map((cat) => cat.id),
          );
          setSelectedCategories([]);
        } catch (error) {
          console.error("Error deleting categories:", error);
        }
      },
    });
  };

  const handleDelete = (category: UpdateCategoryValues) => {
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
          setDeleteId(0);
        }
      },
    });
  };

  const handleView = (category: UpdateCategoryValues) => {
    // Generate a slug from the title if slug doesn't exist
    const slug =
      category.slug ||
      category.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-");
    router.push(`/admin/${slug}`);
  };

  const handleRowSelectionChange = (selectedRows: UpdateCategoryValues[]) => {
    setSelectedCategories(selectedRows);
  };

  // Create columns for the category table (after handlers are defined)
  const columns = createCategoryColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    deletingIds: deleteIdState,
  });

  return (
    <div className="mx-auto p-6">
      <div className="mb-5 flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Category Management"
          subtitle="Manage your collection categories"
          isFetching={isFetching}
          setOpenMenu={() => setOpenMenu(!openMenu)}
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
      <EditCategoryPopover />
    </div>
  );
};

export default CategoryManagementPage;
