"use client";
import Table from "./_components/table";
import useAppStore from "~/store/app.store";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/_components/dialog";
import type { wellnessOutput } from "~/server/api/client/types";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";
import useWellnessStore from "~/store/wellness.store";
import { api } from "~/trpc/react";
import { typeLists } from "~/utils/type-list";

const Wellness = () => {
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });
  const {
    setModal,
    setIsLoading,
    formData,
    setFormData,
    resetForm,
    setOpenMenu,
    openMenu,
  } = useAppStore((state) => ({
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
    isFetching,
    refetch,
  } = api.wellness.get.useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } = api.wellness.create.useMutation({
    onSuccess: async () => {
      resetForm();
      await refetch();
    },
  });

  const { mutate: updateData, isPending: pendingUpdate } = api.wellness.update.useMutation({
    onSuccess: async () => {
      resetForm();
      await refetch();
    },
  });

  const { mutate: deleteData, isPending: pendingDelete } = api.wellness.delete.useMutation({
    onSuccess: async () => {
      resetForm();
      await refetch();
    },
  });

  useEffect(() => {
    setIsLoading(pendingCreate || pendingUpdate || pendingDelete);
  }, [pendingCreate, pendingUpdate, pendingDelete]);


  useEffect(() => {
    if (!isFetched) return;
    setData(data?.data ?? []);
    setPageCount(Math.ceil(data?.total || 0 / perPage));
  }, [data, isFetched]);

  const handleSave = async () => {
    createData({
      ...formData,
      description: formData.description || formData.title,
      type: formData.type || typeLists[0]!.value,
    });
    setModal(false);
  };
  const handleUpdate = async () => {
    updateData(formData as wellnessOutput);
    setModal(false);
  };

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

  const onDelete = (row: Row<wellnessOutput>) => {
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
            <span className="text-2xl">Wellness</span>
          </div>
          <Button onClick={() => setModal(true)} className="flex gap-2">
            <PlusIcon className="h-4 w-4" />
            Add New
          </Button>
        </div>
        <hr />
        <Table {...{ onEdit, onDelete, loading: isFetching }} />
        </div>
    </>
  );
};

export default Wellness;
