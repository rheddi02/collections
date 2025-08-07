"use client";
import useAppStore from "~/store/app.store";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/admin/[type]/_components/dialog";
import { api } from "~/trpc/react";
import { ToastTypes } from "~/utils/types";
import PageTable from "../_components/table/page-table";
import { createColumns } from "~/app/admin/[type]/_components/columns";
import PageHeader from "../_components/page-header";
import type { linkListOutput } from "~/server/api/client/types";
import { useApiUtils } from "~/hooks/useApiUtils";
import { LinkFormValues } from "~/utils/schemas";

// Type for individual link data from the list
type LinkData = NonNullable<linkListOutput['data'][number]>;

interface PageProps {
  params: {
    type: string;
  };
}

const DynamicPage = ({ params }: PageProps) => {
  const { type: pageTitle } = params;

  const utils = useApiUtils();
  const [category, setCategory] = useState<
    { id: number; title: string } | undefined
  >();
  const [initialData, setInitialData] = useState<Partial<LinkFormValues> | undefined>();
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });

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

  const onEdit = (row: Row<LinkData>) => {
    setForm({
      title: "Edit Data",
      description: "Edit selected data",
      label: "update",
    });
    
    setInitialData({
      id: row.original.id,
      title: row.original.title,
      description: row.original.description,
      url: row.original.url,
    });
    setModal(true);
  };

  const onDelete = (row: Row<LinkData>) => {
    const rowData = row.original;
    setDeleteId(rowData.id);
    deleteData(rowData.id);
  };

  // Create columns with handlers
  const columns = createColumns({
    onEdit,
    onDelete,
    deleteId,
    pageTitle,
  });


  const { mutate: createData, isPending: pendingCreate } =
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

  const { mutate: updateData, isPending: pendingUpdate } =
    api.update.link.useMutation({
      onSuccess: async () => {
        await utils.list.link.invalidate();
        setToastType({ type: ToastTypes.UPDATED });
        setModal(false);
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
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
    setCategory(data.category!)
  }, [data, isFetched, perPage, setPageCount]);

  useEffect(() => {
    setIsLoading(pendingDelete || pendingUpdate || pendingCreate);
  }, [pendingUpdate, pendingDelete, pendingCreate]);

  useEffect(() => {
    if (!modal) {
      setForm({
        title:"Create New",
        description: "Add new data",
        label: "Create",
      });
      // Reset initial data when modal closes
      setInitialData(undefined);
    }
  }, [modal]);

  const handleSave = (formData: LinkFormValues) => {
    setIsLoading(true);

    // Type guard and data preparation
    createData({
      title: formData.title,
      url: formData.url,
      categoryId: category?.id || 1, // Use category id or default to 1
      description: formData.description || formData.title,
    });
  };

  const handleUpdate = (formData: LinkFormValues) => {
    setIsLoading(true);
    if (!category || typeof formData.id !== "number") return;
    updateData({
      id: formData.id,
      title: formData.title,
      url: formData.url,
      categoryId: category.id || 1,
      description: formData.description,
    });
  };

  return (
    <>
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
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between mb-5">
          <PageHeader
            title={pageTitle}
            setOpenMenu={() => setOpenMenu(!openMenu)}
            isFetching={isFetching}
            reload={refetch}
          />
          <button
            onClick={() => setModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New
          </button>
        </div>
        <hr />
        <PageTable 
          data={data?.data || []} 
          columns={columns}
          loading={isFetching}
        />
      </div>
    </>
  );
};

export default DynamicPage;
