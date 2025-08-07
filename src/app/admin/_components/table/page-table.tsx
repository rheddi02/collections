"use client";
import DataTableCompact from "~/app/admin/_components/table/table-compact";
import type { ColumnDef, Row } from "@tanstack/react-table";
import type { linkListOutput } from "~/server/api/client/types";
import useAppStore from "~/store/app.store";
import DataTable from "./table";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

// Type for individual link data from the list
type LinkData = NonNullable<linkListOutput['data'][number]>;

// Generic PageTable component that accepts any data type
function PageTable<T = LinkData>({
  data,
  loading,
  onRowClick,
  onRowChange,
  hiddenColumns,
  columns,
  selectedRows
}: {
  data: T[];
  onRowClick?: (row: Row<T>) => void;
  onRowChange?: (rows: T[]) => void;
  loading: boolean;
  hiddenColumns?: Record<string, boolean>;
  columns: ColumnDef<T>[];
  selectedRows?: T[];
}): JSX.Element {
  const [isMobileView, setIsMobileView] = useState(false);
  const { pageCount, setPage } = useAppStore((state) => ({
    pageCount: state.pageCount,
    setPage: state.setPage,
  }));

  useEffect(() => {
    setIsMobileView(isMobile);
  }, [isMobile]);

  const onPaginationChange = (page: number) => {
    setPage(page);
  };

  if (isMobileView)
    return (
      <DataTable
        {...{
          data: data,
          columns: columns,
          onPaginationChange,
          onRowClick,
          onRowChange,
          selectedRows: selectedRows,
          hiddenColumns: hiddenColumns ?? {
            id: false,
            title: true,
            description: true,
            type: true,
            actions: true,
            mobile: false,
          },
          pagination: true,
          totalCount: pageCount,
          loading,
        }}
      />
    );
  return (
    <DataTableCompact
      {...{
        data: data,
        columns: columns,
        onPaginationChange,
        onRowClick,
        onRowChange,
        selectedRows: selectedRows,
        hiddenColumns: hiddenColumns ?? {
          id: false,
          title: true,
          description: true,
          type: true,
          actions: true,
          mobile: false,
        },
        pagination: true,
        totalCount: pageCount,
        loading,
      }}
    />
  );
};

export { PageTable };
export default PageTable;
