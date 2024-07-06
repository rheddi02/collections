"use client";
import DataTableCompact from "~/app/_components/table/table-compact";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { EyeOpenIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import type { equipmentOutput } from "~/server/api/client/types";
import Link from "next/link";
import useEquipmentStore from "~/store/equipment-tips.store";

const Table = ({
  onEdit,
  onDelete,
  loading
}: {
  onEdit: (row: Row<equipmentOutput>) => void;
  onDelete: (row: Row<equipmentOutput>) => void;
  loading: boolean
}) => {
  const { data, pageCount, setPage } = useEquipmentStore((state) => ({
    data: state.data,
    pageCount: state.pageCount,
    setPage: state.setPage,
  }));
  const columns: ColumnDef<equipmentOutput>[] = [
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
          <div className="flex items-center gap-2 justify-end">
            <div
              onClick={() => onEdit(row)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-900 hover:cursor-pointer hover:border-2 hover:border-gray-900 hover:bg-transparent hover:text-gray-900"
            >
              <Pencil1Icon className="" />
            </div>
            <div
              onClick={() => onDelete(row)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-gray-900 hover:cursor-pointer hover:border-2 hover:border-gray-900 hover:bg-transparent hover:text-gray-900"
            >
              <TrashIcon />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full text-gray-900 hover:cursor-pointer hover:border-2 hover:border-gray-900 hover:bg-transparent hover:text-gray-900">
              <Link href={row.original.url} target="_blank">
                <EyeOpenIcon />
              </Link>
            </div>
          </div>
        );
      },
      size: 20,
    },
  ];

  const onPaginationChange = (page: number) => {
    setPage(page)
  };
  const onRowChange = () => {null};
  const onRowClick = () => {null};

  return (
    <DataTableCompact
      {...{
        data: data,
        columns: columns,
        onPaginationChange,
        onRowChange,
        onRowClick,
        hiddenColumns: {},
        pagination: true,
        totalCount: pageCount,
        loading
      }}
    />
  );
};

export default Table;
