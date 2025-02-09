import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { Badge } from "~/components/ui/badge";

import { IEvent } from "../types/admin-event.interface";

export const listEventColumns: ColumnDef<IEvent>[] = [
  {
    accessorKey: "name",
    header: "Nama Event",
    cell: ({ row }) => (
      <div>
        <div className="font-semibold">{row.getValue("name")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.venue}, {row.original.city}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => {
      const startDate = new Date(row.original.startDate);
      const endDate = new Date(row.original.endDate);

      return (
        <div className="w-max text-sm">
          <div className="font-semibold">
            {format(startDate, "d MMM yyyy", { locale: id })}
          </div>
          <div className="text-muted-foreground">
            s/d {format(endDate, "d MMM yyyy", { locale: id })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex justify-center text-sm">
          <Badge
            variant={
              status === "PUBLISHED"
                ? "success"
                : status === "DRAFT"
                  ? "info"
                  : "destructive"
            }
          >
            {status === "PUBLISHED"
              ? "Aktif"
              : status === "DRAFT"
                ? "Draft"
                : "Dibatalkan"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "tickets",
    header: "Tiket",
    cell: ({ row }) => {
      const availableTickets = row.original.availableTickets;

      return (
        <div className="text-center text-sm">
          <p className="font-semibold">{availableTickets} tersedia</p>
        </div>
      );
    },
  },
];
