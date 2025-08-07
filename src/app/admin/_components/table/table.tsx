'use client'

import { useSession } from "next-auth/react";
import useAppStore from "~/store/app.store";
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
import { isMobile } from 'react-device-detect';

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
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  pagination = false,
  loading = false,
  totalCount = 0,
  onPaginationChange,
  onRowClick,
  onRowChange,
  hiddenColumns = {},
}: DataTableProps<TData, TValue>) {
  const { data: session } = useSession();
  const [rowSelection, setRowSelection] = useState({});
  const currentPage = useAppStore((state) => state.page);
  const [page, setPage] = useState<PaginationState>({
    pageIndex: currentPage - 1, // Convert from 1-based to 0-based
    pageSize: 0,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...hiddenColumns,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Sync with app store page changes
  useEffect(() => {
    setPage(prev => ({
      ...prev,
      pageIndex: currentPage - 1 // Convert from 1-based to 0-based
    }));
  }, [currentPage]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(page.pageIndex + 1);
    }
  }, [page.pageIndex]);

  useEffect(() => {
    if (isMobile) {
      Object.keys(hiddenColumns).map((key: string)=>hiddenColumns[key] = false)
      setColumnVisibility({ ...hiddenColumns, id: false, actions: false, mobile: true })
      // setColumnVisibility({ title: false, id:false ,description: false, type: false, actions: false })
    }
    else setColumnVisibility({ ...hiddenColumns, actions: !!session })
  }, [hiddenColumns]);

  const table = useReactTable({
    data: data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: page,
    },
    pageCount: totalCount,
    onPaginationChange: setPage,
    manualPagination: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  useEffect(() => {
    if (onRowChange)
      onRowChange(table.getSelectedRowModel().flatRows.map((x) => x.original));
  }, [table.getSelectedRowModel()]);

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
      <Table className="-mt-20 border-separate border-spacing-y-3 sm:-mt-5 sm:px-2">
        <TableHeader className="[&_tr]:border-none [&_tr]:hover:bg-transparent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="[&_th]:px-5 sm:[&_th]:px-8"
            >
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
        <TableBody className="">
          {loading && <TableRowActions type={"loading"} />}
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  className={cn(
                    'group',
                    "sm:rounded-xl sm:outline sm:outline-1",
                    "[&_td]:px-5 [&_td]:sm:px-8 [&_td]:sm:py-[18px]",
                    row.getIsSelected()
                      ? "!bg-transparent sm:outline-gray-500"
                      : "outline-gray-500",
                  )}
                  onClick={() => {
                    if (onRowClick) {
                      onRowClick(row);
                    }
                  }}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-b-2 py-4 sm:border-b-0"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : !loading && <TableRowActions type={"empty"} />}
        </TableBody>
      </Table>
    </div>
    {pagination && <DataTablePaginationPage table={table} />}
    </>
  );
}
