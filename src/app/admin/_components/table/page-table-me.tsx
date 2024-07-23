"use client";
import DataTableCompact from "~/app/admin/_components/table/table-compact";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  Pencil1Icon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { videoOutput } from "~/server/api/client/types";
import useAppStore from "~/store/app.store";
import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import DataTable from "./table";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

const PageTableMe = ({
  data,
  onDelete,
  loading,
  onEdit,
  onRowClick
}: {
  data: videoOutput[]
  onDelete: (row: Row<videoOutput>) => void;
  onRowClick: (row: Row<videoOutput>) => void;
  onEdit: (row: Row<videoOutput>) => void;
  loading: boolean;
}) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const { pageCount, setPage, deleteId } = useAppStore((state) => ({
    pageCount: state.pageCount,
    setPage: state.setPage,
    deleteId: state.deleteId,
  }));
  const columns: ColumnDef<videoOutput>[] = [
    {
      accessorKey: "id",
    },
    {
      accessorKey: "title",
      header: () => {
        return <div className="font-bold">Title</div>;
      },
      cell: ({ row }) => {
        return <div className="">{row.getValue("title")}</div>;
      },
    },
    {
      accessorKey: "actions",
      header: () => {
        return <div className="font-bold"></div>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2 p-1">
            {deleteId.includes(row.getValue("id")) ? (
              <div className="flex items-center gap-1 rounded-full border px-2 py-1">
                <ReloadIcon className="animate-spin" />
                Deleting ...
              </div>
            ) : (
              <>
                <Pencil1Icon
                  className=" size-5 hover:cursor-pointer hover:text-red-600 flex "
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(row)
                  }}
                />
                <TrashIcon
                  className=" size-5 hover:cursor-pointer hover:text-red-600 flex "
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(row)
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "mobile",
      header: () => {
        return <div className="font-bold"></div>;
      },
      cell: ({ row }) => {
        return (
          <div
            className="flex flex-col justify-center gap-2 p-1"
            onClick={() => onRowClick(row)}
          >
            <Label>{row.getValue("title")}</Label>
            <div className="flex justify-between">
            <div></div>
              {deleteId.includes(row.getValue("id")) ? (
                <div className="flex items-center gap-1">
                  <ReloadIcon className="animate-spin" />
                  Deleting...
                </div>
              ) : (
                <ToggleGroup type="single" size="sm">
                  <ToggleGroupItem
                    value="edit"
                    aria-label="Toggle edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                  >
                    <Pencil1Icon className="flex size-5 hover:cursor-pointer hover:text-red-600" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="delete"
                    aria-label="Toggle delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    <TrashIcon className="flex size-5 hover:cursor-pointer hover:text-red-600" />
                  </ToggleGroupItem>
                </ToggleGroup>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setIsMobileView(true);
  }, [isMobile]);

  const onPaginationChange = (page: number) => {
    setPage(page);
  };
  const onRowChange = () => {
    null;
  };
  // const onRowDivClick = (row: Row<videoOutput>) => {
  //   if (isMobileView) window.open(row.original.url, "_blank");
  // };
  // const onRowClick = (row: Row<videoOutput>) => {
  //   console.log("🚀 ~ onRowClick ~ row:", row)
  //   null;
  // };

  if (isMobileView)
    return (
      <DataTable
        {...{
          data: data,
          columns: columns,
          onPaginationChange,
          onRowChange,
          onRowClick,
          hiddenColumns: {
            id: false,
            title: true,
            actions: true,
            mobile: false,
          },
          pagination: true,
          totalCount: pageCount,
          loading,
        }}
      />
    );
  return (
    <DataTableCompact
      {...{
        data: data,
        columns: columns,
        onPaginationChange,
        onRowChange,
        onRowClick,
        hiddenColumns: {
          id: false,
          title: true,
          actions: true,
          mobile: false,
        },
        pagination: true,
        totalCount: pageCount,
        loading,
      }}
    />
  );
};

export default PageTableMe;
