"use client";
import DataTableCompact from "~/app/admin/_components/table/table-compact";
import type { ColumnDef, Row } from "@tanstack/react-table";
import type { linkListOutput } from "~/server/api/client/types";
import useAppStore from "~/store/app.store";
import DataTable from "./data-table";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

// Type for individual link data from the list
type LinkData = NonNullable<linkListOutput["data"][number]>;

// Generic PageTable component that accepts any data type
function PageTable<T = LinkData>({
  data,
  loading,
  onRowClick,
  onRowChange,
  hiddenColumns,
  columns,
  selectedRows,
}: {
  data: T[];
  onRowClick?: (row: Row<T>) => void;
  onRowChange?: (rows: T[]) => void;
  loading: boolean;
  hiddenColumns?: Record<string, boolean>;
  columns: ColumnDef<T>[];
  selectedRows?: T[];
}): JSX.Element {
  const { pageCount, setPage } = useAppStore((state) => ({
    pageCount: state.pageCount,
    setPage: state.setPage,
  }));

  const onPaginationChange = (page: number) => {
    setPage(page);
  };

  return (
    <DataTable
      {...{
        data,
        columns,
        onPaginationChange,
        onRowClick,
        onRowChange,
        selectedRows,
        hiddenColumns,
        pagination: true,
        totalCount: pageCount,
        loading,
        isMobile,
      }}
    />
  );
}

export { PageTable };
export default PageTable;
