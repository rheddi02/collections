"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { EyeOpenIcon, Pencil1Icon, TrashIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import type { categoryOutput } from "~/server/api/client/types";

// Define the category type with count
type CategoryWithCount = categoryOutput & {
  _count?: {
    Links: number;
  };
};

interface CategoryColumnsProps {
  onView: (category: CategoryWithCount) => void;
  onEdit: (category: CategoryWithCount) => void;
  onDelete: (category: CategoryWithCount) => void;
  deletingIds: number[];
}

export const createCategoryColumns = ({
  onView,
  onEdit,
  onDelete,
  deletingIds,
}: CategoryColumnsProps): ColumnDef<CategoryWithCount>[] => [
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
    accessorKey: "_count.Links",
    header: "Links Count",
    cell: ({ row }) => {
      const count = row.original._count?.Links ?? 0;
      return (
        <span className="font-mono text-sm">{count}</span>
      );
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
