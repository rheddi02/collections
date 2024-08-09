"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAppStore from "~/store/app.store";
import { PlusIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { ToastTypes } from "~/utils/types";
import type { Row } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { coinInput, coinOutput } from "~/server/api/client/types";
import PageTableCoin from "../_components/table/page-table-coin";
import { Type } from "@prisma/client";
import FormDialog from "./_components/form-dialog";

const Page = () => {
  const router = useRouter();
  const appStore = useAppStore();
  const utils = api.useUtils();
  const [coins, setCoins] = useState<coinOutput[]>([]);
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });
  const { setPageCount, page, perPage } = useAppStore();
  const { data: data, isFetching } = api.list.coin.useQuery({ page, perPage });
  const { data: categories } = api.list.category.useQuery({});
  const [formData, setFormData] = useState<coinInput>({
    title: "",
    description: "",
    type: Type.OLD,
    categoryId: 0,
    year: "",
    url: "",
  });

  const { mutate: createData, isPending: pendingCreate } =
    api.create.coin.useMutation({
      onSuccess: async () => {
        await utils.list.coin.invalidate();
      },
      onSettled: () => {
        appStore.setIsLoading(false);
        setFormData({
          title: "",
          description: "",
          type: Type.OLD,
          categoryId: 0,
          year: "",
          url: "",
        });
        appStore.setModal(false);
        appStore.setToastType(ToastTypes.ADDED);
      },
    });

  const { mutate: updateData, isPending: pendingUpdate } =
    api.update.coin.useMutation({
      onSuccess: async () => {
        await utils.list.coin.invalidate();
      },
      onSettled: () => {
        appStore.setModal(false);
        setFormData({
          title: "",
          description: "",
          type: Type.OLD,
          categoryId: 0,
          year: "",
          url: "",
        });
        appStore.setToastType(ToastTypes.UPDATED);
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
    api.delete.coin.useMutation({
      onSuccess: async () => {
        await utils.list.coin.invalidate();
      },
      onSettled: () => {
        appStore.setToastType(ToastTypes.DELETED);
        appStore.setDeleteId(0);
        appStore.setModal(false);
      },
    });

  useEffect(() => {
    if (data?.data) setCoins(data.data);
    setPageCount(Math.ceil((data?.total || 0) / perPage));
  }, [data]);

  useEffect(() => {
    if (!appStore.modal)
      setForm({
        title: "Create New",
        description: "Add new data",
        label: "Create",
      });
  }, [appStore.modal]);

  useEffect(() => {
    appStore.setPasscodeModal(false);
  }, []);

  useEffect(() => {
    appStore.setIsLoading(pendingDelete || pendingUpdate || pendingCreate);
  }, [pendingUpdate, pendingDelete, pendingCreate]);

  const handleSave = () => {
    createData({
      ...formData,
      description: formData.description || formData.title,
      type: (formData.type as Type) || Type.OLD,
    });
  };

  const handleUpdate = () => {
    const tmpForm = formData as coinOutput;
    updateData(tmpForm);
  };

  const handleReturn = () => {
    router.push("/client");
  };

  const handleShowDialog = () => {
    appStore.setModal(true);
    // setShow(!show);
  };

  const onRowClick = (row: Row<coinOutput>) => {
    window.open(row.original.url, "_blank");
  };

  const onEdit = (row: Row<coinOutput>) => {
    setForm({
      title: "Edit Data",
      description: "Edit selected data",
      label: "update",
    });
    setFormData({
      ...row.original,
    });
    appStore.setModal(true);
  };

  const onDelete = (row: Row<coinOutput>) => {
    appStore.setDeleteId(row.original.id);
    deleteData(row.original.id);
  };

  return (
    <>
      <FormDialog
        {...{ formData, setFormData, categories: categories?.data }}
        action={form.label == "update" ? handleUpdate : handleSave}
      />
      <div>
        <div className="flex items-center justify-between gap-2 bg-gray-700 p-5 text-gray-50">
          <div
            onClick={handleReturn}
            className="flex w-full items-center gap-2"
          >
            Coins
          </div>
          {coins.length > 0 && (
            <div
              className="rounded-full bg-gray-50 p-2 text-gray-700 hover:cursor-pointer"
              onClick={handleShowDialog}
            >
              <PlusIcon className="size-6" />
            </div>
          )}
        </div>
        {coins.length > 0 ? (
          <>
            <div className="mt-10 sm:mt-0 sm:p-5">
              <PageTableCoin
                {...{
                  data: coins,
                  onDelete,
                  onRowClick,
                  onEdit,
                  loading: isFetching,
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex h-[90vh] w-full flex-col items-center justify-center gap-5">
            <Button className="size-20 rounded-full" onClick={handleShowDialog}>
              <PlusIcon className="size-10" />
            </Button>
            <span className="text-gray-500">
              Nothing to show here, create your first record.
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Page;
