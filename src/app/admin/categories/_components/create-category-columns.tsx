"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil1Icon, TrashIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import type { categoryListOutput } from "~/server/api/client/types";
import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

interface CategoryColumnsProps {
  onView: (category: categoryListOutput) => void;
  onEdit: (category: categoryListOutput) => void;
  onDelete: (category: categoryListOutput) => void;
  deletingIds: number[];
}

export const createCategoryColumns = ({
  onView,
  onEdit,
  onDelete,
  deletingIds,
}: CategoryColumnsProps): ColumnDef<categoryListOutput>[] => [
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium capitalize">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "categoryLinks",
    header: "Links Count",
    cell: ({ row }) => {
      const count = (row.getValue("categoryLinks") as number) ?? 0;
      return <span className="font-mono text-sm">{count}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {new Date(row.getValue("createdAt")).toLocaleDateString()}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const isDeleting = deletingIds.includes(row.getValue("id"));

      return (
        <div className="flex items-center gap-1">
          {isDeleting ? (
            <div className="flex items-center gap-1 rounded-full border px-2 py-1">
              <ReloadIcon className="h-4 w-4 animate-spin" />
              Deleting...
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(row.original);
                }}
                className="h-8 w-8 p-0"
                title="Edit category"
              >
                <Pencil1Icon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(row.original);
                }}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                title="Delete category"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
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
            <div className="text-sm text-gray-600">
              Links: {row.getValue("categoryLinks")}
            </div>
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
