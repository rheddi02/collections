"use client";

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
}: DataTableProps<TData, TValue>) {
  const isAuth = useAppStore((state) => state.isAuth);
  const [rowSelection, setRowSelection] = useState({});
  const [page, setPage] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 0,
  });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    ...hiddenColumns,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(page.pageIndex + 1);
    }
  }, [page.pageIndex]);

  useEffect(() => {
    if (isMobile) {
      Object.keys(hiddenColumns).map(
        (key: string) => (hiddenColumns[key] = false),
      );
      setColumnVisibility({
        ...hiddenColumns,
        id: false,
        actions: false,
        mobile: true,
      });
    } else setColumnVisibility({ ...hiddenColumns, actions: isAuth });
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
