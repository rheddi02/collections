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
import { ToastTypes } from "~/utils/types";
import PageTable from "../_components/table/page-table";

const Page = () => {
  const path = usePathname();
  const [pageTitle] = useState(path.split("/")[1]);
  const [deleteRow, setDeleteRow] = useState(0);
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
  } = useAppStore();

  const {
    setData,
    page,
    perPage,
    setPageCount,
    deleteCode,
    setDeleteCodeModal,
  } = useAppStore();
  const {
    data: data,
    isFetched,
    isFetching,
  } = api.list.plantTip.useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } =
    api.create.plantTip.useMutation({
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
    api.update.plantTip.useMutation({
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
    api.delete.plantTip.useMutation({
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
    if (deleteCode) onDelete();
  }, [deleteCode]);

  useEffect(() => {
    if (!modal)
      setForm({
        title: "Create New",
        description: "Add new data",
        label: "Create",
      });
  }, [modal]);

  const invalidateList = async () => {
    await utils.list.plantTip.invalidate();
  };
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

  const onDeleteCheck = (row: Row<CommonOutputType>) => {
    setDeleteRow(row.original.id);
    if ((process.env.NEXT_PUBLIC_DELETE as unknown as string) == "true")
      setDeleteCodeModal(true);
    else onDelete();
  };
  // const onDelete = (row: Row<CommonOutputType>) => {
  const onDelete = () => {
    setDeleteId(deleteRow);
    deleteData(deleteRow);
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
        <PageTable {...{ onEdit, onDelete: onDeleteCheck, loading: false }} />
      </div>
    </>
  );
};

export default Page;
