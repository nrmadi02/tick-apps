"use client";

import {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { DataTable } from "~/components/common/react-table";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

import { listEventColumns } from "../columns/list-event.column";

export default function ListEventSection() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });
  const events = api.adminEvent.getList.useQuery({
    limit: pagination.pageSize,
    page: pagination.pageIndex,
  });

  const columns = useMemo(
    () => [...listEventColumns],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events.data],
  );

  return (
    <div className="pt-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Management Event</h1>
          <p>List of event</p>
        </div>
        <Link href="/admin/event/add">
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Add Event
          </Button>
        </Link>
      </div>
      <div className="mt-5">
        <DataTable
          className="bg-[#FFFFFF]"
          statePagination={{
            pageCount: 200,
            pagination,
            setPagination,
          }}
          stateSelection={{
            rowSelection,
            setRowSelection,
          }}
          columns={columns}
          data={events.data?.data || []}
          isLoading={events.isLoading}
          stateSorting={{
            sorting,
            setSorting,
          }}
        />
      </div>
    </div>
  );
}
