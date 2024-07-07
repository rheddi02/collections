"use client";
import Table from "./_components/table";
import useAppStore from "~/store/app.store";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/_components/dialog";
import type { CommonOutputType } from "~/server/api/client/types";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { usePathname } from "next/navigation";

const Page = () => {
  const path = usePathname();
  const [pageTitle] = useState(path.split('/')[1])
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
    setDeleteId
  } = useAppStore((state) => ({
    modal: state.modal,
    isLoading: state.isLoading,
    setModal: state.setModal,
    setIsLoading: state.setIsLoading,
    formData: state.formData,
    setFormData: state.setFormData,
    resetForm: state.resetForm,
    openMenu: state.openMenu,
    setOpenMenu: state.setOpenMenu,
    setToastType: state.setToastType,
    setDeleteId: state.setDeleteId,
  }));

  const { setData, page, perPage, setPageCount } = useAppStore((state) => ({
    setData: state.setData,
    page: state.page,
    perPage: state.perPage,
    setPageCount: state.setPageCount,
  }));
  const {
    data: data,
    isFetched,
    isFetching,
  } = api.list.petTip.useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } =
    api.create.petTip.useMutation({
      onSuccess: async () => {
        await invalidateList()
      },
      onSettled: () => {
        setModal(false);
        resetForm();
        setToastType('create')
      },
    });

  const { mutate: updateData, isPending: pendingUpdate } =
    api.update.petTip.useMutation({
      onSuccess: async () => {
        await invalidateList()
      },
      onSettled: () => {
        setModal(false);
        resetForm();
        setToastType('updated')
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
    api.delete.petTip.useMutation({
      onSuccess: async () => {
        await invalidateList()
      },
      onSettled: () => {
        setModal(false);
        setToastType('delete')
        setDeleteId(0)
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

  useEffect( () => {
    if (!modal) setForm({title: "Create New",description: "Add new data",label: "Create",});
  },[modal])

  const invalidateList = async () => {
    await utils.list.petTip.invalidate();
  }
  const handleSave = () => {
    createData({
      ...formData,
      description: formData.description || formData.title,
      type: formData.type || "general",
    });
  };
  const handleUpdate = () => {
    const tmpForm = formData as CommonOutputType;
    updateData(tmpForm);
  };

  const onEdit = (row: Row<CommonOutputType>) => {
    setForm({
      title: "Edit Data",
      description: "Edit selected data",
      label: "update",
    });
    setFormData({
      ...row.original,
    });
    setModal(true);
  };

  const onDelete = (row: Row<CommonOutputType>) => {
    setDeleteId(row.original.id)
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
        <Table {...{ onEdit, onDelete, loading: false }} />
      </div>
    </>
  );
};

export default Page;
