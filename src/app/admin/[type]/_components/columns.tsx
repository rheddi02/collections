"use client";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { EyeOpenIcon, Pencil1Icon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { linkListOutput } from "~/server/api/client/types";
import Link from "next/link";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { ToggleGroup } from "~/components/ui/toggle-group";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";

type LinkData = NonNullable<linkListOutput['data'][number]>;

interface ColumnsProps {
  onEdit: (row: Row<LinkData>) => void;
  onDelete: (row: Row<LinkData>) => void;
  deleteId: number[];
  pageTitle: string;
}

export const createColumns = ({ onEdit, onDelete, deleteId, pageTitle }: ColumnsProps): ColumnDef<LinkData>[] => [
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
      const descriptions: string = row.getValue("description")
      return <>
        {
          <div className="">{descriptions}</div>
        }
      </>;
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="font-bold"></div>;
    },
    cell: ({ row }: {row: Row<LinkData>}) => {
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
                className=" size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex "
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onEdit(row)
                }}
              />
              <TrashIcon
                className=" size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex "
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onDelete(row)
                }}
              />
              <Link href={row.original.url || '#'} target="_blank">
                <EyeOpenIcon className=" size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex " />
              </Link>
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
        <div className="flex flex-col justify-center gap-2 p-1">
          <Label>{row.getValue("title")}</Label>
          <div>{row.getValue("description")}</div>
          <div className="flex justify-between">
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
  },
];
