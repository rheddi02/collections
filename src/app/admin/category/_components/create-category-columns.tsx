"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeOpenIcon, Pencil1Icon, TrashIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import type { categoryOutput } from "~/server/api/client/types";

interface CategoryColumnsProps {
  onView: (category: categoryOutput) => void;
  onEdit: (category: categoryOutput) => void;
  onDelete: (category: categoryOutput) => void;
  deletingIds: number[];
}

export const createCategoryColumns = ({
  onView,
  onEdit,
  onDelete,
  deletingIds,
}: CategoryColumnsProps): ColumnDef<categoryOutput>[] => [
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
    header: "Category Name",
    cell: ({ row }) => (
      <span className="font-medium capitalize">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "isPinned",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isPinned") ? "default" : "outline"}>
        {row.getValue("isPinned") ? "Pinned" : "Active"}
      </Badge>
    ),
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
      const category = row.original;
      const isDeleting = deletingIds.includes(category.id);

      return (
        <div className="flex items-center gap-1">
          {isDeleting ? (
            <div className="flex items-center gap-1 rounded-full border px-2 py-1">
              <ReloadIcon className="animate-spin h-4 w-4" />
              Deleting...
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView(category);
                }}
                className="h-8 w-8 p-0"
                title="View category"
              >
                <EyeOpenIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(category);
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
                  onDelete(category);
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
];
