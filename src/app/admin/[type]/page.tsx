"use client";
import useAppStore from "~/store/app.store";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/_components/dialog";
import type { CommonOutputType } from "~/server/api/client/types";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { ToastTypes } from "~/utils/types";
import PageTable from "~/app/admin/_components/table/page-table";

// Map tip types to their API endpoints
const TIP_TYPE_MAP = {
  beauty: 'beautyTip',
  equipment: 'equipmentTip',
  food: 'foodTip',
  health: 'healthTip',
  home: 'homeTip',
  pet: 'petTip',
  cloth: 'clothTip',
  plant: 'plantTip',
  machinery: 'machineryTip',
  ride: 'rideTip',
  leisure: 'leisureTip',
  energy: 'energyTip',
} as const;

type TipType = keyof typeof TIP_TYPE_MAP;

interface PageProps {
  params: {
    type: TipType;
  };
}

const CategoryPage = ({ params }: PageProps) => {
  const { type } = params;
  const pageTitle = type;
  const apiEndpoint = TIP_TYPE_MAP[type];
  
  const utils = api.useUtils();
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });

  const {
    modal,
    setModal,
    setIsLoading,
    formData,
    setFormData,
    resetForm,
    openMenu,
    setOpenMenu,
    setToastType,
    setDeleteId,
    setData,
    page,
    perPage,
    setPageCount,
  } = useAppStore();

  // Dynamic API calls based on tip type with server-side auth
  const {
    data: data,
    isFetched,
    isFetching,
  } = (api.list as any)[apiEndpoint].useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } =
    (api.create as any)[apiEndpoint].useMutation({
      onSuccess: async () => {
        await invalidateList();
      },
      onSettled: () => {
        setModal(false);
        resetForm();
        setToastType(ToastTypes.ADDED);
      },
    });

  const { mutate: updateData, isPending: pendingUpdate } =
    (api.update as any)[apiEndpoint].useMutation({
      onSuccess: async () => {
        await invalidateList();
      },
      onSettled: () => {
        setModal(false);
        resetForm();
        setToastType(ToastTypes.UPDATED);
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
    (api.delete as any)[apiEndpoint].useMutation({
      onSuccess: async () => {
        await invalidateList();
      },
      onSettled: () => {
        setModal(false);
        setToastType(ToastTypes.DELETED);
        setDeleteId(0);
      },
    });

  useEffect(() => {
    if (!isFetched) return;
    setData(data?.data ?? []);
    setPageCount(Math.ceil((data?.total || 0) / perPage));
  }, [data, isFetched]);

  useEffect(() => {
    setIsLoading(pendingDelete || pendingUpdate || pendingCreate);
  }, [pendingUpdate, pendingDelete, pendingCreate]);

  useEffect(() => {
    if (!modal)
      setForm({
        title: "Create New",
        description: "Add new data",
        label: "Create",
      });
  }, [modal]);

  const invalidateList = async () => {
    await (utils.list as any)[apiEndpoint].invalidate();
  };

  const handleSave = () => {
    createData({
      ...formData,
      description: formData.description || formData.title,
    });
  };

  const handleUpdate = () => {
    const tmpForm = formData as unknown as CommonOutputType;
    updateData(tmpForm);
  };

  const onEdit = (row: Row<CommonOutputType>) => {
    setForm({
      title: "Edit Data",
      description: "Edit selected data",
      label: "update",
    });
    setFormData({
      title: row.original.title,
      description: row.original.description,
      url: row.original.url,
      isPublic: row.original.isPublic,
      categoryId: 1, // Default categoryId since CommonOutputType doesn't have it
    });
    setModal(true);
  };

  const onDelete = (row: Row<CommonOutputType>) => {
    setDeleteId(row.original.id);
    deleteData(row.original.id);
  };

  return (
    <>
      <CustomDialog
        {...{ ...form }}
        action={form.label == "update" ? handleUpdate : handleSave}
      />
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span onClick={() => setOpenMenu(!openMenu)}>
              <HamburgerMenuIcon className="block h-5 w-5 sm:hidden" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl capitalize">{pageTitle}</span>
              {isFetching && <ReloadIcon className="animate-spin" />}
            </div>
          </div>
          <Button onClick={() => setModal(true)} className="flex gap-2">
            <PlusIcon className="h-4 w-4" />
            Add New
          </Button>
        </div>
        <hr />
        <PageTable {...{ onEdit, onDelete, loading: isFetching }} />
      </div>
    </>
  );
};

export default CategoryPage;
