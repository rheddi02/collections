"use client";
import DataTableCompact from "~/app/_components/table/table-compact";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { EyeOpenIcon, Pencil1Icon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import type { CommonOutputType } from "~/server/api/client/types";
import Link from "next/link";
import useAppStore from "~/store/app.store";

const Table = ({
  onEdit,
  onDelete,
  loading
}: {
  onEdit: (row: Row<CommonOutputType>) => void;
  onDelete: (row: Row<CommonOutputType>) => void;
  loading: boolean
}) => {
  const { data, pageCount, setPage, deleteId } = useAppStore((state) => ({
    data: state.data,
    pageCount: state.pageCount,
    setPage: state.setPage,
    deleteId: state.deleteId,
  }));
  const columns: ColumnDef<CommonOutputType>[] = [
    {
      accessorKey: 'id'
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
          <div className="items-center gap-2 justify-center p-1 flex">
            {
              deleteId === row.getValue('id') ? <div className="border rounded-full px-2 py-1 flex items-center gap-1">
                <ReloadIcon className="animate-spin" />
                Deleting ...
              </div> : <>
            <Pencil1Icon className="hover:cursor-pointer hover:text-red-600 size-5 group-hover:flex hidden " onClick={() => onEdit(row)}/>
            <TrashIcon className="hover:cursor-pointer hover:text-red-600 size-5 group-hover:flex hidden " onClick={() => onDelete(row)}/>
            <Link href={row.original.url} target="_blank">
              <EyeOpenIcon className="hover:cursor-pointer hover:text-red-600 size-5 group-hover:flex hidden " />
            </Link>
              </>
            }
          </div>
        );
      },
      maxSize: 100,
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
        hiddenColumns: { id: false},
        pagination: true,
        totalCount: pageCount,
        loading
      }}
    />
  );
};

export default Table;
