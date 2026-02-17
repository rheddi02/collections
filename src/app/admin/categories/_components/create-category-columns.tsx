"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil1Icon, TrashIcon, ReloadIcon, Link1Icon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
// import type { categoryListAllOutput } from "~/server/api/client/types";
import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { UpdateCategoryValues } from "~/utils/schemas";

// categoryListAllOutput is the type for a single category row
interface CategoryColumnsProps {
  onEdit: (category: UpdateCategoryValues) => void;
  onDelete: (category: UpdateCategoryValues) => void;
  deletingIds: number[];
  onView?: (category: UpdateCategoryValues) => void;
}

export const createCategoryColumns = ({
  onEdit,
  onDelete,
  deletingIds,
  onView,
}: CategoryColumnsProps): ColumnDef<UpdateCategoryValues>[] => [
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
      const isDeleting = deletingIds.includes(row.original.id);

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
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
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
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                title="Delete category"
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(row.original);
                }}
                className="h-8 w-8 p-0 text-primary hover:bg-primary/10 hover:text-primary"
                title="Open links"
              >
                <Link1Icon className="h-4 w-4" />
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
            {deletingIds.includes(row.original.id) ? (
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
