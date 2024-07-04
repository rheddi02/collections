"use client";
import Table from "./_components/table";
import useAppStore from "~/store/app.store";
import { DELETE } from "./_actions/api";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/_components/dialog";
import type { wellnessOutput } from "~/server/api/client/types";
import useAsyncEffect from "use-async-effect";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import useWellnessStore from "~/store/wellness.store";
import { useCreateWellness, useUpdateWellness, useWellness } from "~/hooks/useWellness";

const Wellness = () => {
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });
  const [recentData, setRecentData] = useState<wellnessOutput>({
    id: 0,
    title: "",
    description: "",
    url: "",
    type: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const { setModal, setIsLoading, formData, setFormData, resetForm, setOpenMenu, openMenu } =
    useAppStore((state) => ({
      modal: state.modal,
      setModal: state.setModal,
      setIsLoading: state.setIsLoading,
      formData: state.formData,
      setFormData: state.setFormData,
      resetForm: state.resetForm,
      setOpenMenu: state.setOpenMenu,
      openMenu: state.openMenu,
    }));

  const { setData, page, perPage, setPageCount } = useWellnessStore(
    (state) => ({
      setData: state.setData,
      page: state.page,
      perPage: state.perPage,
      setPageCount: state.setPageCount,
    }),
  );
  const {
    data: data,
    isFetched,
    refetch,
  } = useWellness({ page, perPage });

  useAsyncEffect(async () => {
    if (recentData?.id) await refetch();
    resetForm();
  }, [recentData]);

  useEffect(() => {
    if (!isFetched) return;
    setData(data?.data ?? []);
    setPageCount(Math.ceil(data?.total || 0 / perPage));
  }, [data, isFetched]);

  const handleSave = async () => {
    setIsLoading(true);
    await create({...formData, description: formData.description || formData.title});
    setIsLoading(false);
    setModal(false);
  };
  const handleUpdate = async () => {
    setIsLoading(true);
    await update(formData as wellnessOutput);
    setIsLoading(false);
    setModal(false);
  };

  const onSuccess = async (data: wellnessOutput) => {
    setRecentData(data);
  };
  const { mutateAsync: update } =
    useUpdateWellness(onSuccess);
  const { mutateAsync: create } =
    useCreateWellness(onSuccess);

  const onEdit = (row: Row<wellnessOutput>) => {
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

  const onDelete = async (row: Row<wellnessOutput>) => {
    await DELETE(row.original.id);
    await refetch();
    setRecentData(row.original);
  };

  return (
    <>
      <CustomDialog
        {...{ ...form }}
        action={form.label == "update" ? handleUpdate : handleSave}
      />
      <div className="flex flex-col gap-2 p-5">
        <div className="flex sm:items-center flex-col sm:flex-row sm:justify-between font-bold gap-2">
          <div className="flex items-center gap-2">
            <span onClick={() => setOpenMenu(!openMenu)}>
              <HamburgerMenuIcon className="block h-5 w-5 sm:hidden" />
            </span>
            <span className="text-2xl">Wellness</span>
          </div>
          <Button onClick={() => setModal(true)} className="flex gap-2">
            <PlusIcon className="h-4 w-4" />
            Add New
          </Button>
        </div>
        <hr />
        <Table {...{ onEdit, onDelete }} />
      </div>
    </>
  );
};

export default Wellness;
