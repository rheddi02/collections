"use client";
import DataTableCompact from "~/app/admin/_components/table/table-compact";
import type { ColumnDef, Row } from "@tanstack/react-table";
import {
  EyeOpenIcon,
  Pencil1Icon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { CommonOutputType } from "~/server/api/client/types";
import Link from "next/link";
import useAppStore from "~/store/app.store";
import { Badge } from "~/components/ui/badge";
import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import DataTable from "./table";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

const PageTable = ({
  data,
  onEdit,
  onDelete,
  loading,
  onRowClick,
  hiddenColumns,
  columns,
  formatDescription
}: {
  data: CommonOutputType[];
  onEdit: (row: Row<CommonOutputType>) => void;
  onDelete: (row: Row<CommonOutputType>) => void;
  onRowClick?: (row: Row<CommonOutputType>) => void;
  loading: boolean;
  hiddenColumns?: Record<string, boolean>;
  formatDescription?: boolean;
  columns: ColumnDef<CommonOutputType>[];
}) => {
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

export default PageTable;
