"use client";
import Table from "./_components/table";
import useAppStore from "~/store/app.store";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/_components/dialog";
import type { homeImprovementOutput } from "~/server/api/client/types";
import useHomeImprovementStore from "~/store/home-improvement.store";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";

const HomeImprovement = () => {
  const { toast } = useToast();
  const utils = api.useUtils();
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
    openMenu,
    setOpenMenu,
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
  }));

  const { setData, page, perPage, setPageCount } = useHomeImprovementStore(
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
  } = api.homeImprovement.get.useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } =
    api.homeImprovement.create.useMutation({
      onSuccess: async () => {
        await utils.homeImprovement.invalidate();
      },
      onSettled: () => {
        setModal(false);
        resetForm();
      },
    });

  const { mutate: updateData, isPending: pendingUpdate } =
    api.homeImprovement.update.useMutation({
      onSuccess: async () => {
        await utils.homeImprovement.invalidate();
      },
      onSettled: () => {
        setModal(false);
        resetForm();
        setForm({
          title: "Create New",
          description: "Add new data",
          label: "Create",
        });
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
    api.homeImprovement.delete.useMutation({
      onSuccess: async () => {
        await utils.homeImprovement.invalidate();
      },
      onSettled: () => {
        setModal(false);
        toast({
          title: 'Deleted',
          description: 'Record has been deleted successfully.',
          action: (
            <ToastAction onClick={() => null} altText="">
              Close
            </ToastAction>
          ),
        });
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

  const handleSave = () => {
    createData({
      ...formData,
      description: formData.description || formData.title,
      type: formData.type || "general",
    });
  };
  const handleUpdate = () => {
    const tmpForm = formData as homeImprovementOutput;
    updateData(tmpForm);
  };

  const onEdit = (row: Row<homeImprovementOutput>) => {
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

  const onDelete = (row: Row<homeImprovementOutput>) => {
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
              <span className="text-2xl">Home Improvements</span>
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

export default HomeImprovement;
