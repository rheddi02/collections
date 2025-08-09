"use client";
import useAppStore from "~/store/app.store";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/admin/[type]/_components/create-list-dialog";
import { api } from "~/trpc/react";
import { ToastTypes } from "~/utils/types";
import PageTable from "../_components/table/page-table";
import { createListColumns } from "~/app/admin/[type]/_components/create-list-columns";
import PageHeader from "../_components/page-header";
import type { linkListOutput } from "~/server/api/client/types";
import { useApiUtils } from "~/hooks/useApiUtils";
import { LinkFormValues } from "~/utils/schemas";
import PageAction from "../_components/page-action";
import { cn } from "~/lib/utils";
import { isMobile } from "react-device-detect";
import { Button } from "~/components/ui/button";
import { useConfirmDialog } from "~/hooks";

// Type for individual link data from the list
type LinkData = NonNullable<linkListOutput["data"][number]>;

interface PageProps {
  params: {
    type: string;
  };
}

const DynamicPage = ({ params }: PageProps) => {
  const { type: pageTitle } = params;

  const utils = useApiUtils();
  const { confirm } = useConfirmDialog();
  const [category, setCategory] = useState<
    { id: number; title: string } | undefined
  >();
  const [initialData, setInitialData] = useState<
    Partial<LinkFormValues> | undefined
  >();
  
  const [selectedLinks, setSelectedLinks] = useState<LinkData[]>([]);
  const [editData, setEditData] = useState<LinkData | null>(null);
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });

  const [isClient, setIsClient] = useState(false);

  // Set client flag after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    modal,
    setModal,
    setIsLoading,
    openMenu,
    setOpenMenu,
    setToastType,
    setDeleteId,
    deleteId,
    page,
    perPage,
    setPageCount,
  } = useAppStore((state) => ({
    modal: state.modal,
    setModal: state.setModal,
    deleteId: state.deleteId,
    setIsLoading: state.setIsLoading,
    openMenu: state.openMenu,
    setOpenMenu: state.setOpenMenu,
    setToastType: state.setToastType,
    setDeleteId: state.setDeleteId,
    page: state.page,
    perPage: state.perPage,
    setPageCount: state.setPageCount,
  }));

  // Dynamic API calls based on tip type with server-side auth
  const { data, isFetched, isFetching, refetch } = api.list.link.useQuery({
    categoryTitle: pageTitle,
    page,
    perPage,
  });

  const handleEdit = (link: LinkData) => {
    setForm({
      title: "Update Link",
      description: "Update the selected link's details.",
      label: "update",
    });
    setInitialData({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
    });
    setModal(true);
  };

  const handleDelete = (link: LinkData) => {
    // Clear all selected links when deleting any link
    setSelectedLinks([]);
    
    confirm({
      title: "Delete Link",
      description: `Are you sure you want to delete the link "${link.title}"? This action cannot be undone.`,
      warningText:
        "This will permanently delete the link.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        setDeleteId(link.id);
        try {
          await deleteLinkMutation([link.id]);
        } finally {
          setDeleteId(0);
        }
      },
    });
  };

  const handleDeleteMultipe = async () => {
    confirm({
      title: "Delete Links",
      description: `Are you sure you want to delete the selected links? This action cannot be undone.`,
      warningText:
        "This will permanently delete the links.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        const linkIds = selectedLinks.map(link => link.id);
        try {
          setDeleteId(linkIds);
          await deleteLinkMutation(linkIds);
          setSelectedLinks([]);
        } catch (error) {
          console.error("Error deleting links:", error);
        } finally {
          setDeleteId(0);
        }
      },
    });
  };

  // Create columns with handlers
  const columns = createListColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    deletingIds: deleteId,
  });

  const { mutate: createLinkMutation, isPending: pendingCreate } =
    api.create.link.useMutation({
      onSuccess: async () => {
        await utils.list.link.invalidate();
        setToastType({ type: ToastTypes.ADDED });
        setModal(false);
      },
      onError: (err) => {
        setToastType({ type: ToastTypes.ERROR, data: err.message });
      },
    });

  const { mutate: updateLinkMutation, isPending: pendingUpdate } =
    api.update.link.useMutation({
      onSuccess: async () => {
        await utils.list.link.invalidate();
        setToastType({ type: ToastTypes.UPDATED });
        setModal(false);
      },
    });

  const { mutateAsync: deleteLinkMutation, isPending: pendingDelete } =
    api.delete.link.useMutation({
      onSuccess: async () => {
        await utils.list.link.invalidate();
        setToastType({ type: ToastTypes.DELETED });
        setModal(false);
        setDeleteId(0);
      },
    });

  useEffect(() => {
    if (!isFetched || !data) return;
    setPageCount(data.totalPages);
    setCategory(data.category!);
  }, [data, isFetched, perPage, setPageCount]);

  useEffect(() => {
    setIsLoading(pendingDelete || pendingUpdate || pendingCreate);
  }, [pendingUpdate, pendingDelete, pendingCreate]);

  useEffect(() => {
    if (!modal) {
      setForm({
        title: "Create New",
        description: "Add new data",
        label: "Create",
      });
      // Reset initial data when modal closes
      setInitialData(undefined);
    }
  }, [modal]);

  const handleRowSelectionChange = (selectedRows: LinkData[]) => {
    setSelectedLinks(selectedRows);
  };

  const handleSave = (formData: LinkFormValues) => {
    setIsLoading(true);

    // Type guard and data preparation
    createLinkMutation({
      title: formData.title,
      url: formData.url,
      categoryId: category?.id || 1, // Use category id or default to 1
      description: formData.description || formData.title,
    });
  };

  const handleUpdate = (formData: LinkFormValues) => {
    setIsLoading(true);
    if (!category || typeof formData.id !== "number") return;
    updateLinkMutation({
      id: formData.id,
      title: formData.title,
      url: formData.url,
      categoryId: category.id || 1,
      description: formData.description,
    });
  };

  return (
    <div
      className={cn(isClient && isMobile && "overflow-hidden overscroll-none")}
    >
      <CustomDialog
        {...{
          initialData: initialData,
          open: modal,
          action: form.label == "update" ? handleUpdate : handleSave,
          title: form.title,
          description: form.description,
          label: form.label,
        }}
      />
      <div
        className={cn(
          "flex flex-col gap-2 p-5",
          isClient &&
            isMobile &&
            "max-h-screen overflow-hidden overscroll-none",
        )}
      >
        <div className="mb-5 flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
          <PageHeader
            title={pageTitle}
            setOpenMenu={() => setOpenMenu(!openMenu)}
            isFetching={isFetching}
            reload={refetch}
          />
          <div className="flex gap-2">
          {!!selectedLinks.length && (
            <Button variant={"destructive"} onClick={handleDeleteMultipe}>
              Delete ({selectedLinks.length})
            </Button>
          )}
          <PageAction label="Add New" action={() => setModal(true)} />
          </div>
        </div>
        <div
          className={cn(
            isClient && isMobile && "max-h-[calc(100vh-200px)] overflow-auto",
          )}
        >
          <PageTable
            data={data?.data || []}
            columns={columns}
            loading={isFetching}
            onRowChange={handleRowSelectionChange}
            selectedRows={selectedLinks}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
