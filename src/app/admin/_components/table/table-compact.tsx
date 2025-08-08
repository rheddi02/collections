"use client";

import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getSortedRowModel,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { useEffect, useState } from "react";
import { DataTablePaginationPage } from "./pagination";
import { cn } from "~/lib/utils";
import useAppStore from "~/store/app.store";
import { isMobile } from "react-device-detect";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  loading?: boolean;
  totalCount?: number;
  onPaginationChange?: (page: number) => void;
  onRowClick?: (row: Row<TData>) => void;
  onRowChange?: (row: TData[]) => void;
  hiddenColumns?: Record<string, boolean>;
  selectedRows?: TData[];
}

export default function DataTableCompact<TData, TValue>({
  columns,
  data,
  pagination = false,
  loading = false,
  totalCount = 0,
  onPaginationChange,
  onRowClick,
  onRowChange,
  hiddenColumns = {},
  selectedRows = [],
}: DataTableProps<TData, TValue>) {
  const { data: session } = useSession();
  const currentPage = useAppStore((state) => state.page);
  const [page, setPage] = useState<PaginationState>({
    pageIndex: currentPage - 1, // Convert from 1-based to 0-based
    pageSize: 0,
  });
  // Initialize column visibility once and only update on specific triggers
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
    // Start with default visibility (desktop) to match SSR
    return { mobile: false };
  });

  // Update column visibility when mobile state changes (only on client)
  useEffect(() => {
    const visibility: VisibilityState = {};
    
    columns.forEach((column) => {
      // Get column ID from various possible sources
      const columnId = column.id || 
                      (column as any).accessorKey || 
                      (column as any).accessorFn?.name || 
                      '';
      
      if (columnId) {
        if (isMobile) {
          // On mobile: show ONLY mobile column, hide all others
          visibility[columnId] = columnId === 'mobile';
        } else {
          // On desktop: hide ONLY mobile column, show all others
          visibility[columnId] = columnId !== 'mobile';
        }
      }
    });
    
    setColumnVisibility(visibility);
  }, [isMobile, columns]); // Depend on isMobile and columns

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Convert selectedRows to rowSelection object for the table
  const rowSelectionFromProps = React.useMemo(() => {
    if (!selectedRows || selectedRows.length === 0) {
      return {};
    }
    const selection: Record<string, boolean> = {};
    data.forEach((item, index) => {
      const isSelected = selectedRows.some(
        (selectedItem) => JSON.stringify(selectedItem) === JSON.stringify(item),
      );
      if (isSelected) {
        selection[index.toString()] = true;
      }
    });
    return selection;
  }, [selectedRows, data]);

  // Use the computed selection instead of state
  const currentRowSelection = rowSelectionFromProps;

  // Sync with app store page changes
  useEffect(() => {
    setPage((prev) => ({
      ...prev,
      pageIndex: currentPage - 1, // Convert from 1-based to 0-based
    }));
  }, [currentPage]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(page.pageIndex + 1);
    }
  }, [page.pageIndex]);

  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection: currentRowSelection,
      columnFilters,
      pagination: page,
    },
    pageCount: totalCount,
    onPaginationChange: setPage,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      // Handle row selection changes and notify parent
      const newSelection =
        typeof updater === "function" ? updater(currentRowSelection) : updater;
      const selectedItems = data.filter(
        (item, index) => newSelection[index.toString()],
      );
      if (onRowChange) {
        onRowChange(selectedItems);
      }
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const TableRowActions = (props: { type: "loading" | "empty" }) => {
    const actions = {
      loading: (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            Loading data...
          </TableCell>
        </TableRow>
      ),
      empty: (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No data
          </TableCell>
        </TableRow>
      ),
    };

    return actions[props.type];
  };

  return (
    <>
      <div className="max-h-[80vh] overflow-auto">
        <Table className="border">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className={cn(
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRowActions type={"loading"} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    }
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              !loading && <TableRowActions type={"empty"} />
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && <DataTablePaginationPage table={table} />}
    </>
  );
}
