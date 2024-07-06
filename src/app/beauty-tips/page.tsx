"use client";
import Table from "./_components/table";
import useAppStore from "~/store/app.store";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/_components/dialog";
import type { beautyOutput } from "~/server/api/client/types";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import useBeautyStore from "~/store/beauty-tips.store";

const BeautyTips = () => {
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
    setOpenMenu,
    openMenu,
    setToastData
  } = useAppStore((state) => ({
    modal: state.modal,
    setModal: state.setModal,
    setIsLoading: state.setIsLoading,
    formData: state.formData,
    setFormData: state.setFormData,
    resetForm: state.resetForm,
    setOpenMenu: state.setOpenMenu,
    openMenu: state.openMenu,
    setToastData: state.setToastData,
  }));

  const { setData, page, perPage, setPageCount } = useBeautyStore(
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
  } = api.beauty.get.useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } = api.beauty.create.useMutation({
    onSuccess: async () => {
      await utils.beauty.invalidate()
    },
    onSettled: () => {
      setModal(false);
      resetForm();
      setToastData({title:"Added", description:"Record has been added successfully."})
    }
  });

  const { mutate: updateData, isPending: pendingUpdate } = api.beauty.update.useMutation({
    onSuccess: async () => {
      await utils.beauty.invalidate()
    },
    onSettled: () => {
      setModal(false);
      resetForm();
      setToastData({title:"Updated", description:"Record has been updated successfully."})
    }
  });

  const { mutate: deleteData, isPending: pendingDelete } = api.beauty.delete.useMutation({
    onSuccess: async () => {
      await utils.beauty.invalidate()
    },
    onSettled: () => {
      setModal(false);
      resetForm();
      setToastData({title:"Deleted", description:"Record has been deleted successfully."})
    }
  });

  useEffect(() => {
    setIsLoading(pendingCreate || pendingUpdate || pendingDelete);
  }, [pendingCreate, pendingUpdate, pendingDelete]);

  useEffect( () => {
    if (!modal) setForm({title: "Create New",description: "Add new data",label: "Create",});
  },[modal])

  useEffect(() => {
    if (!isFetched) return;
    setData(data?.data ?? []);
    setPageCount(Math.ceil((data?.total || 0) / perPage));
  }, [data, isFetched]);

  const handleSave = async () => {
    createData({
      ...formData,
      description: formData.description || formData.title,
      type: formData.type || "general",
    });
    setModal(false);
  };
  const handleUpdate = async () => {
    updateData(formData as beautyOutput);
    setModal(false);
  };

  const onEdit = (row: Row<beautyOutput>) => {
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

  const onDelete = (row: Row<beautyOutput>) => {
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
            <div className="flex gap-2 items-center">
              <span className="text-2xl">Beauty Tips</span>
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

export default BeautyTips;
