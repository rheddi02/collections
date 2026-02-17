"use client";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  ExternalLinkIcon,
  EyeOpenIcon,
  Pencil1Icon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Label } from "~/components/ui/label";
import { ToggleGroup } from "~/components/ui/toggle-group";
import { ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { Checkbox } from "~/components/ui/checkbox";
import { getSource } from "~/utils/helpers";
import { UpdateLinkValues } from "~/utils/schemas";
import { PlaySquareIcon } from "lucide-react";

interface ColumnsProps {
  onEdit: (link: UpdateLinkValues) => void;
  onDelete: (link: UpdateLinkValues) => void;
  onPlay?: (link: UpdateLinkValues) => void;
  deletingIds: number[];
}

export const createListColumns = ({
  onEdit,
  onDelete,
  onPlay,
  deletingIds,
}: ColumnsProps): ColumnDef<UpdateLinkValues>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 20,
    minSize: 20,
    maxSize: 20,
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
      const descriptions: string = row.getValue("description");
      return <>{<div className="">{descriptions}</div>}</>;
    },
  },
  {
    accessorKey: "url",
    header: () => {
      return <div className="font-bold">Source</div>;
    },
    cell: ({ row }) => {
      const siteUrl: string = row.getValue("url");
      return <>{<div className="">{getSource(siteUrl)}</div>}</>;
    },
  },
  {
    accessorKey: "actions",
    header: () => {
      return <div className="font-bold"></div>;
    },
    cell: ({ row }: { row: Row<UpdateLinkValues> }) => {
      return (
        <div className="flex items-center justify-center gap-2 p-1">
          {deletingIds.includes(row.original.id) ? (
            <div className="flex items-center gap-1 rounded-full border px-2 py-1">
              <ReloadIcon className="animate-spin" />
              Deleting ...
            </div>
          ) : (
            <>
              <Pencil1Icon
                className=" size-5 hover:cursor-pointer hover:text-blue-600 group-hover:flex "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(row.original);
                }}
              />
              <PlaySquareIcon
                className="size-5 hover:cursor-pointer hover:text-green-600 group-hover:flex"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPlay && onPlay(row.original);
                }}
              />
              <TrashIcon
                className=" size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(row.original);
                }}
              />
              <Link href={row.original.url || "#"} target="_blank">
                <ExternalLinkIcon className=" size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex " />
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
        <div className="flex justify-between gap-2 p-1">
          <div className="flex flex-col">
            <Label className="text-xl">{row.getValue("title")}</Label>
            <div>{row.getValue("description")}</div>
          </div>
          <div className="flex justify-between">
            {deletingIds.includes(row.getValue("id")) ? (
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
                    onEdit(row.original);
                  }}
                >
                  <Pencil1Icon className="flex size-5 hover:cursor-pointer hover:text-red-600" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="delete"
                  aria-label="Toggle delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(row.original);
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
