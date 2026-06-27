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
import { getSource, isPlayableVideo, truncateText } from "~/utils/helpers";
import { UpdateCategoryValues, UpdateLinkValues } from "~/utils/schemas";
import { CopyIcon, FolderInputIcon, PlaySquareIcon } from "lucide-react";
import { Tooltip } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ColumnsProps {
  onEdit: (link: UpdateLinkValues) => void;
  onDelete: (link: UpdateLinkValues) => void;
  onPlay?: (link: UpdateLinkValues) => void;
  onMove: (link: UpdateLinkValues, categoryId: number) => void;
  onCopy?: () => void;
  deletingIds: number[];
  isAdmin?: boolean;
  categories: UpdateCategoryValues[];
  currentCategoryId: number;
}

export const createListColumns = ({
  onEdit,
  onDelete,
  onPlay,
  onMove,
  onCopy,
  deletingIds,
  isAdmin,
  categories,
  currentCategoryId,
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
      return (
        <>{<div className="truncate">{truncateText(descriptions, 30)}</div>}</>
      );
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
              <Tooltip label="Edit record">
                <Pencil1Icon
                  className=" size-5 hover:cursor-pointer hover:text-blue-600 group-hover:flex "
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(row.original);
                  }}
                />
              </Tooltip>
              {isAdmin && (
                <Tooltip label="Play link">
                  <PlaySquareIcon
                    className={cn(
                      "size-5 hover:cursor-pointer hover:text-green-600 group-hover:flex",
                      !isPlayableVideo(row.original.url) &&
                        "cursor-not-allowed opacity-50",
                    )}
                    onClick={(e) => {
                      if (!isPlayableVideo(row.original.url)) return;
                      e.preventDefault();
                      e.stopPropagation();
                      onPlay && onPlay(row.original);
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip label="Delete record">
                <TrashIcon
                  className=" size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex "
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(row.original);
                  }}
                />
              </Tooltip>
              <Tooltip label="Open in new tab">
                <Link href={row.original.url || "#"} target="_blank">
                  <ExternalLinkIcon className=" size-5 hover:cursor-pointer hover:text-red-600 group-hover:flex " />
                </Link>
              </Tooltip>
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
            <Label className="text-sm font-medium tracking-tight">{row.getValue("title")}</Label>
          </div>
          <div className="flex items-center gap-2">
            {deletingIds.includes(row.getValue("id")) ? (
              <div className="flex items-center gap-1">
                <ReloadIcon className="animate-spin" />
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Edit"
                  className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                  onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}
                >
                  <Pencil1Icon className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Delete"
                  className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                  onClick={(e) => { e.stopPropagation(); onDelete(row.original); }}
                >
                  <TrashIcon className="size-4 text-destructive" />
                </button>
                <button
                  type="button"
                  aria-label="Copy URL"
                  className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(row.original.url ?? "");
                    onCopy?.();
                  }}
                >
                  <CopyIcon className="size-4" />
                </button>
              </div>
            )}
            {!deletingIds.includes(row.getValue("id")) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                    aria-label="Move to category"
                  >
                    <FolderInputIcon className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {categories
                    .filter((c) => c.id !== currentCategoryId)
                    .map((cat) => (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMove(row.original, cat.id);
                        }}
                      >
                        {cat.title}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      );
    },
  },
];
