"use client";
import Table from "./_components/table";
import useAppStore from "~/store/app.store";
import { DELETE } from "./_actions/api";
import type { Row } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import CustomDialog from "~/app/_components/dialog";
import type { homeImprovementOutput } from "~/server/api/client/types";
import useHomeImprovementStore from "~/store/home-improvement.store";
import {
  useCreateHomeImprovement,
  useHomeImprovement,
  useUpdateHomeImprovement,
} from "~/hooks/useHomeImprovement";
import useAsyncEffect from "use-async-effect";
import { Button } from "~/components/ui/button";
import { HamburgerMenuIcon, PlusIcon } from "@radix-ui/react-icons";

const HomeImprovement = () => {
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });
  const [recentData, setRecentData] = useState<homeImprovementOutput>({
    id: 0,
    title: "",
    description: "",
    url: "",
    type: "",
    createdAt: new Date(),
    updatedAt: new Date(),
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
    data: homeImprovements,
    isFetched,
    refetch,
  } = useHomeImprovement({ page, perPage });

  useAsyncEffect(async () => {
    if (recentData?.id) await refetch();
    resetForm();
  }, [recentData]);

  useEffect(() => {
    if (!isFetched) return;
    setData(homeImprovements?.data ?? []);
    setPageCount(Math.ceil(homeImprovements?.total || 0 / perPage));
  }, [homeImprovements, isFetched]);

  const handleSave = async () => {
    setIsLoading(true);
    await createHomeImprovement({
      ...formData,
      description: formData.description || formData.title,
    });
    setIsLoading(false);
    setModal(false);
  };
  const handleUpdate = async () => {
    const tmpForm = formData as homeImprovementOutput
    setIsLoading(true);
    await updateHomeImprovement(tmpForm);
    setIsLoading(false);
    setModal(false);
  };

  const onSuccess = async (data: homeImprovementOutput) => {
    setRecentData(data);
  };
  const { mutateAsync: updateHomeImprovement } =
    useUpdateHomeImprovement(onSuccess);
  const { mutateAsync: createHomeImprovement } =
    useCreateHomeImprovement(onSuccess);

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

  const onDelete = async (row: Row<homeImprovementOutput>) => {
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
            <span className="text-2xl">Home Improvements</span>
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

export default HomeImprovement;
