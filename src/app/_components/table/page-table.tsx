"use client";
import DataTableCompact from "~/app/_components/table/table-compact";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  EyeOpenIcon,
  Pencil1Icon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { CommonOutputType } from "~/server/api/client/types";
import Link from "next/link";
import useAppStore from "~/store/app.store";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import DataTable from "./table";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

const PageTable = ({
  onEdit,
  onDelete,
  loading,
}: {
  onEdit: (row: Row<CommonOutputType>) => void;
  onDelete: (row: Row<CommonOutputType>) => void;
  loading: boolean;
}) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const { data, pageCount, setPage, deleteId } = useAppStore((state) => ({
    data: state.data,
    pageCount: state.pageCount,
    setPage: state.setPage,
    deleteId: state.deleteId,
  }));
  const columns: ColumnDef<CommonOutputType>[] = [
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
      accessorKey: "description",
      header: () => {
        return <div className="font-bold">Description</div>;
      },
      cell: ({ row }) => {
        return <div className="">{row.getValue("description")}</div>;
      },
    },
    {
      accessorKey: "type",
      header: () => {
        return <div className="font-bold">Type</div>;
      },
      cell: ({ row }) => {
        return <div className="">{row.getValue("type")}</div>;
      },
      size: 20,
    },
    {
      accessorKey: "actions",
      header: () => {
        return <div className="font-bold"></div>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 p-1">
            {deleteId.includes(row.getValue("id")) ? (
              <div className="flex items-center gap-1 rounded-full border px-2 py-1">
                <ReloadIcon className="animate-spin" />
                Deleting ...
              </div>
            ) : (
              <>
                <Pencil1Icon
                  className="hidden size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex "
                  onClick={() => onEdit(row)}
                />
                <TrashIcon
                  className="hidden size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex "
                  onClick={() => onDelete(row)}
                />
                <Link href={row.original.url} target="_blank">
                  <EyeOpenIcon className="hidden size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex " />
                </Link>
              </>
            )}
          </div>
        );
      },
      maxSize: 100,
    },
    {
      accessorKey: "mobile",
      header: () => {
        return <div className="font-bold"></div>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex flex-col justify-center gap-2 p-1" onClick={() => onRowDivClick(row)}>
            <Label>{row.getValue("title")}</Label>
            <div>{row.getValue("description")}</div>
            <div className="flex justify-between">
              <Badge variant="default" className="uppercase">
                {row.getValue("type")}
              </Badge>
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
                      e.stopPropagation()
                      onEdit(row)
                    }}
                  >
                    <Pencil1Icon className="flex size-5 hover:cursor-pointer hover:text-red-600" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="delete"
                    aria-label="Toggle delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(row)
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
      maxSize: 100,
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
  const onRowDivClick = (row: Row<CommonOutputType>) => {
    if (isMobileView) window.open(row.original.url, '_blank')
  }
  const onRowClick = (row: Row<CommonOutputType>) => {
    null
  };

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
            description: true,
            type: true,
            actions: true,
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
          description: true,
          type: true,
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

export default PageTable;
