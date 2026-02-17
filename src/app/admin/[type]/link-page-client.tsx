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
import { useApiUtils } from "~/hooks/useApiUtils";
import {
  LinkFormValues,
  UpdateCategoryValues,
  UpdateLinkValues,
} from "~/utils/schemas";
import PageAction from "../_components/page-action";
import { cn } from "~/lib/utils";
import { isMobile } from "react-device-detect";
import { Button } from "~/components/ui/button";
import { useConfirmDialog } from "~/hooks";
import PageFilters from "../_components/page-filters";
import FacebookReel from "~/components/facebook-reel";
import PlaybackDialog from "../_components/playback-dialog";

// Type for individual link data from the list

interface LinkPageClientProps {
  initialData: UpdateCategoryValues;
  pageTitle: string;
}

const LinkPageClient = ({ initialData, pageTitle }: LinkPageClientProps) => {
  const utils = useApiUtils();
  const confirmDialog = useConfirmDialog();
  const confirm = confirmDialog?.confirm;

  // Fallback confirm function in case the hook fails
  const fallbackConfirm = (options: any) => {
    if (typeof window !== "undefined" && window.confirm) {
      if (window.confirm(options.description)) {
        options.onConfirm?.();
      }
    }
  };

  // Use fallback if main confirm is not available
  const safeConfirm = confirm || fallbackConfirm;
  const [category, setCategory] = useState(initialData);
  const [initialFormValues, setInitialFormValues] = useState<
    Partial<LinkFormValues> | undefined
  >();

  const [selectedLinks, setSelectedLinks] = useState<UpdateLinkValues[]>([]);
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });

  const [isClient, setIsClient] = useState(false);
  const [playUrl, setPlayUrl] = useState<UpdateLinkValues | null>(null);

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
    filters,
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
    filters: state.filters,
  }));

  // Ensure confirm function is available
  const isConfirmReady = Boolean(safeConfirm);

  // Dynamic API calls based on tip type with server-side auth
  const { data, isFetched, isFetching, refetch } = api.links.list.useQuery(
    {
      categoryTitle: initialData.title,
      page,
      perPage,
      filters,
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  );

  const handleEdit = (link: UpdateLinkValues) => {
    setForm({
      title: "Update Link",
      description: "Update the selected link's details.",
      label: "update",
    });
    setInitialFormValues({
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description,
    });
    setModal(true);
  };

  const handleDelete = (link: UpdateLinkValues) => {
    // Clear all selected links when deleting any link
    setSelectedLinks([]);

    if (!isClient || !isConfirmReady) return;

    try {
      safeConfirm({
        title: "Delete Link",
        description: `Are you sure you want to delete the link "${link.title}"? This action cannot be undone.`,
        warningText: "This will permanently delete the link.",
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
    } catch (error) {
      console.error("Error opening confirm dialog:", error);
    }
  };

  const handleDeleteMultipe = async () => {
    if (!isClient || !isConfirmReady) return;

    try {
      safeConfirm({
        title: "Delete Links",
        description: `Are you sure you want to delete the selected links? This action cannot be undone.`,
        warningText: "This will permanently delete the links.",
        confirmText: "Delete",
        cancelText: "Cancel",
        variant: "destructive",
        onConfirm: async () => {
          const linkIds = selectedLinks.map((link) => link.id);
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
    } catch (error) {
      console.error("Error opening confirm dialog:", error);
    }
  };

  const handlePlayVideo = (link: UpdateLinkValues) => {
    // const url = link.url;
    setPlayUrl(link);
    // if (url.includes("facebook.com")) {
    //   // Open Facebook Reel in a new tab
    //   window.open(url, "_blank");
    // }
  };

  // Create columns with handlers
  const columns = createListColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    deletingIds: deleteId,
    onPlay: handlePlayVideo
  });

  const { mutate: createLinkMutation, isPending: pendingCreate } =
    api.links.create.useMutation({
      onSuccess: async () => {
        await utils.links.list.invalidate();
        setToastType({ type: ToastTypes.ADDED });
        setModal(false);
      },
      onError: (err) => {
        setToastType({ type: ToastTypes.ERROR, data: err.message });
      },
    });

  const { mutate: updateLinkMutation, isPending: pendingUpdate } =
    api.links.update.useMutation({
      onSuccess: async () => {
        await utils.links.list.invalidate();
        setToastType({ type: ToastTypes.UPDATED });
        setModal(false);
      },
    });

  const { mutateAsync: deleteLinkMutation, isPending: pendingDelete } =
    api.links.delete.useMutation({
      onSuccess: async () => {
        await utils.links.list.invalidate();
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
      setInitialFormValues(undefined);
    }
  }, [modal]);

  const handleRowSelectionChange = (selectedRows: UpdateLinkValues[]) => {
    setSelectedLinks(selectedRows);
  };

  const handleSave = (formData: LinkFormValues) => {
    createLinkMutation({
      title: formData.title,
      url: formData.url,
      categoryId: category?.id || 1, // Use category id or default to 1
      description: formData.description || formData.title,
    });
  };

  const handleUpdate = (formData: UpdateLinkValues) => {
    updateLinkMutation({
      id: formData.id,
      title: formData.title,
      url: formData.url,
      categoryId: category.id || 1,
      description: formData.description,
    });
  };

  const handleAction = (formData: LinkFormValues | UpdateLinkValues) => {
    if (form.label === "update") {
      handleUpdate(formData as UpdateLinkValues); // Ensure correct type
    } else {
      handleSave(formData as LinkFormValues);
    }
  };

  const isReady = isClient && isConfirmReady;

  return (
    <div
      className={cn(
        "relative transition-opacity duration-200",
        isClient && isMobile && "overflow-hidden overscroll-none",
        !isReady && "pointer-events-none opacity-50",
      )}
    >
      {!isReady && (
        <div className="absolute right-4 top-4 z-50 transition-opacity duration-200">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        </div>
      )}
      <PlaybackDialog link={playUrl} />
      <CustomDialog
        {...{
          initialData: initialFormValues,
          open: modal,
          action: handleAction,
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
            title={initialData.title}
            setOpenMenu={() => setOpenMenu(!openMenu)}
            isFetching={isFetching}
            reload={refetch}
          />
          <div className="flex gap-2">
            {!!selectedLinks.length && (
              <Button
              variant={"destructive"}
              onClick={handleDeleteMultipe}
              disabled={!isReady}
              >
                Delete ({selectedLinks.length})
              </Button>
            )}
            <PageAction
              label="Add New"
              action={() => setModal(true)}
              disabled={!isReady}
              />
          </div>
        </div>
        <PageFilters className="mb-5" placeholder="Search by title" />
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

export default LinkPageClient;
