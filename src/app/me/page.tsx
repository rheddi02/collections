"use client";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAppStore from "~/store/app.store";
import MeDialog from "./_components/dialog";
import { ArrowLeftIcon, PlusIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { ToastTypes } from "~/utils/types";
import type { Row } from "@tanstack/react-table";
import type { videoOutput } from "~/server/api/client/types";
import PageTableMe from "../admin/_components/table/page-table-me";

const Page = () => {
  const router = useRouter();
  const appStore = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const utils = api.useUtils();
  const [show, setShow] = useState(false);

  const {
    setPageCount,
    page,
    perPage,
  } = useAppStore();
  const {
    data: data,
  } = api.list.video.useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } =
    api.create.video.useMutation({
      onSuccess: async () => {
        await utils.list.video.invalidate();
      },
      onSettled: () => {
        setIsLoading(!isLoading);
        setShow(false);
        appStore.setToastType(ToastTypes.ADDED);
      },
    });

  const { mutate: deleteData, isPending: pendingDelete } =
    api.delete.video.useMutation({
      onSuccess: async () => {
        await utils.list.video.invalidate();
      },
      onSettled: () => {
        setShow(false);
        appStore.setToastType(ToastTypes.DELETED);
        appStore.setDeleteId(0);
      },
    });

    useEffect(() => {
      setPageCount(Math.ceil((data?.total || 0) / perPage));
    }, [data]);

  useEffect(() => {
    appStore.setPasscodeModal(false);
    if (!appStore.isMe) redirect("/client");
  }, []);

  const handleSave = (url: string) => {
    setIsLoading(!isLoading);
    setShow(!show);
    createData({
      url,
      title: url.split('/')[3] ?? url
    })
  };

  const handleReturn = () => {
    router.push("/client");
  };

  const handleShowDialog = () => {
    setShow(!show)
  }

  const onRowClick = (row: Row<videoOutput>) => {
    // router.push(row.original.url)
    window.open(row.original.url, '_blank')
  }

  const onDelete = (row: Row<videoOutput>) => {
    appStore.setDeleteId(row.original.id)
    deleteData(row.original.id);
  }

  return (
    <>
      <MeDialog {...{ isLoading, show, setShow, action: handleSave }} />
      <div>
        <div className="flex items-center justify-between gap-2 bg-red-700 p-5 text-red-50">
          <div onClick={handleReturn} className="flex items-center gap-2 w-full">
            <ArrowLeftIcon className="size-10 rounded-full bg-red-50 p-2 text-red-700" />
            Me
          </div>
          <div className="rounded-full bg-red-50 text-red-700 p-2 hover:cursor-pointer" onClick={handleShowDialog}>
            <PlusIcon className="size-6" />
          </div>
        </div>
        <div className="mt-5">

        <PageTableMe {...{ data: data?.data ?? [], onDelete, onRowClick, loading: false }} />
        </div>
        </div>
    </>
  );
};

export default Page;
