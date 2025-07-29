"use client";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAppStore from "~/store/app.store";
import { ArrowLeftIcon, PlusIcon } from "@radix-ui/react-icons";
import { api } from "~/trpc/react";
import { ToastTypes } from "~/utils/types";
import type { Row } from "@tanstack/react-table";
import type { videoOutput } from "~/server/api/client/types";
import VideoPlayer from "./_components/video-player";
import PageTableMe from "../admin/_components/table/page-table-me";
import CustomDialog from "../_components/dialog";
import { Button } from "~/components/ui/button";

const Page = () => {
  const router = useRouter();
  const appStore = useAppStore();
  const utils = api.useUtils();
  const [videos, setVideos] = useState<videoOutput[]>([])
  const [form, setForm] = useState({
    title: "Create New",
    description: "Add new data",
    label: "Create",
  });
  const { setPageCount, page, perPage } = useAppStore();
  const { data: data } = api.list.video.useQuery({ page, perPage });

  const { mutate: createData, isPending: pendingCreate } =
    api.create.video.useMutation({
      onSuccess: async () => {
        await utils.list.video.invalidate();
      },
      onSettled: () => {
        appStore.setIsLoading(false);
        appStore.resetForm();
        appStore.setModal(false)
        appStore.setToastType(ToastTypes.ADDED);
      },
    });


  const { mutate: updateData, isPending: pendingUpdate } =
  api.update.video.useMutation({
    onSuccess: async () => {
      await utils.list.video.invalidate();
    },
    onSettled: () => {
      appStore.setModal(false);
      appStore.resetForm();
      appStore.setToastType(ToastTypes.UPDATED);
    },
  });


  const { mutate: deleteData, isPending: pendingDelete } =
    api.delete.video.useMutation({
      onSuccess: async () => {
        await utils.list.video.invalidate();
      },
      onSettled: () => {
        appStore.setToastType(ToastTypes.DELETED);
        appStore.setDeleteId(0);
        appStore.setModal(false)
      },
    });

  useEffect(() => {
    if (data?.data) setVideos(data.data)
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
    if (!appStore.isMe) redirect("/client");
  }, []);

  useEffect(() => {
    appStore.setIsLoading(pendingDelete || pendingUpdate || pendingCreate);
  }, [pendingUpdate, pendingDelete, pendingCreate]);

  const handleSave = () => {
    createData({
      ...appStore.formData,
      description: appStore.formData.description || appStore.formData.title,
      type: appStore.formData.type || "general",
    });
  };

  const handleUpdate = () => {
    const tmpForm = appStore.formData as videoOutput;
    updateData(tmpForm);
  };

  const handleReturn = () => {
    router.push("/client");
  };

  const handleShowDialog = () => {
    appStore.setModal(true)
    // setShow(!show);
  };

  const onRowClick = (row: Row<videoOutput>) => {
    // router.push(row.original.url)
    window.open(row.original.url, "_blank");
  };

  const onEdit = (row: Row<videoOutput>) => {
    setForm({
      title: "Edit Data",
      description: "Edit selected data",
      label: "update",
    });
    appStore.setFormData({
      ...row.original,
    });
    appStore.setModal(true);
  };

  const onDelete = (row: Row<videoOutput>) => {
    appStore.setDeleteId(row.original.id);
    deleteData(row.original.id);
  };

  const deleteVideo = (id: number) => {
    deleteData(id);
  }
  

  return (
    <>
      <CustomDialog
        {...{ ...form }}
        action={form.label == "update" ? handleUpdate : handleSave}
      />
      <div>
        <div className="flex items-center justify-between gap-2 bg-red-700 p-5 text-red-50">
          <div
            onClick={handleReturn}
            className="flex w-full items-center gap-2"
          >
            <ArrowLeftIcon className="size-10 rounded-full bg-red-50 p-2 text-red-700" />
            Me
          </div>
          {
            videos.length > 0 &&
          <div
          className="rounded-full bg-red-50 p-2 text-red-700 hover:cursor-pointer"
          onClick={handleShowDialog}
          >
            <PlusIcon className="size-6" />
          </div>
          }
        </div>
        {
          videos.length > 0 ? <>
        <div className="mt-10 sm:mt-0 sm:p-5">
          <PageTableMe {...{ data: videos, onDelete, onRowClick, onEdit, loading: false }} />
          {/* <VideoPlayer {...{data: videos,deleteVideo}}/> */}
        </div>
          </>
          : <div className="flex items-center justify-center h-[90vh] w-full flex-col gap-5">
          <Button className="rounded-full size-20" onClick={handleShowDialog}>
            <PlusIcon className="size-10"/>
          </Button>
          <span className="text-gray-500">
          Nothing to show here, create your first record.
          </span>
          </div>
        }
      </div>
    </>
  );
};

export default Page;
