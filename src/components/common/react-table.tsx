"use client";

import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2Icon, SortAsc, SortDesc } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

import PaginationTable from "./pagination-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  stateSorting?: {
    sorting: SortingState;
    setSorting: OnChangeFn<SortingState>;
  };
  statePagination?: {
    pagination: PaginationState | undefined;
    pageCount: number;
    setPagination: OnChangeFn<PaginationState> | undefined;
  };
  stateSelection?: {
    rowSelection: RowSelectionState;
    setRowSelection: OnChangeFn<RowSelectionState>;
  };
  className?: string;
  isLoading?: boolean;
  getRowIdFunc?: (row: TData) => string;
}

export function SortingIndicator({ type }: { type?: "asc" | "desc" }) {
  return (
    <div className="flex flex-col items-center">
      <SortAsc
        className={cn(
          "h-4 text-sm text-white transition-all",
          type === "desc" && "hidden",
        )}
      />
      <SortDesc
        className={cn(
          "h-4 text-sm text-white transition-all",
          type === "asc" && "hidden",
        )}
      />
    </div>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  stateSorting,
  stateSelection,
  statePagination,
  className,
  isLoading,
  getRowIdFunc,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: stateSorting?.setSorting,
    onRowSelectionChange: stateSelection?.setRowSelection,
    state: {
      sorting: stateSorting?.sorting,
      rowSelection: stateSelection?.rowSelection,
    },
    manualPagination: true,
    getRowId: getRowIdFunc,
  });

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded border">
        <Table
          className={cn("w-full min-w-[800px] table-auto md:w-full", className)}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-1 justify-center w-full"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: <SortingIndicator type="asc" />,
                            desc: <SortingIndicator type="desc" />,
                          }[header.column.getIsSorted() as string] ?? (
                            <>
                              {header.column.getCanSort() ?? (
                                <SortingIndicator />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2Icon className="mr-2 size-4 animate-spin" />{" "}
                      Loading...
                    </div>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <>
                {table.getRowCount() > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
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
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No data.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      {statePagination && (
        <PaginationTable
          currentPage={statePagination.pagination?.pageIndex ?? 0}
          totalCount={
            statePagination.pageCount !== 0 ? statePagination.pageCount : 1
          }
          pageSize={statePagination.pagination?.pageSize ?? 0}
          siblingCount={1}
          onPageChange={(value) => {
            statePagination.setPagination?.((e) => ({
              ...e,
              pageIndex: value,
            }));
          }}
        />
      )}
    </div>
  );
}
