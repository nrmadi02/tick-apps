"use client";

import {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DeleteConfirmationModal } from "~/components/common/modal-delete-confirmation";
import { DataTable } from "~/components/common/react-table";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/trpc/react";

import { listEventColumns } from "../columns/list-event.column";
import { IEvent } from "../types/admin-event.interface";

export default function ListEventSection() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [selectData, setSelectData] = useState<IEvent>();

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
    () => [
      ...listEventColumns,
      {
        header: "Aksi",
        id: "actions",
        cell: ({ row }) => {
          const event = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Buka menu</span>
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(event.id)}
                  >
                    Copy ID Event
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/admin/event/${event.id}/edit`)}
                  >
                    Edit Event
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setOpen(true);
                      setSelectData(event);
                    }}
                    className="text-destructive"
                  >
                    Hapus Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events.data],
  );

  const { mutateAsync, isPending } = api.adminEvent.delete.useMutation({
    onSuccess: () => {
      setOpen(false);
      setSelectData(undefined);
      events.refetch();
    },
  });

  const handleDelete = async () => {
    try {
      await mutateAsync({
        id: selectData?.id || "",
      });
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
      toast.error("Failed to delete event");
    }
  };

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
            pageCount: events.data?.meta?.totalPages || 0,
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
      <DeleteConfirmationModal
        title="Delete Event"
        description="Are you sure you want to delete this event?"
        onConfirm={() => {
          handleDelete();
        }}
        isOpen={open}
        setOpen={setOpen}
        isLoading={isPending}
      />
    </div>
  );
}
