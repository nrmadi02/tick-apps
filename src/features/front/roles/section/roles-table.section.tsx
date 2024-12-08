"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export default function RolesTableSection() {
  const { data, isLoading, error } = api.role.getAllRoles.useQuery();

  if (isLoading) {
    return <div className="p-5">Loading...</div>;
  }

  if (error) {
    return <div className="p-5">{error.message}</div>;
  }

  if (!data) {
    return <div className="p-5">No data</div>;
  }

  return (
    <section className="p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-bold">Roles</p>
      </div>

      <Table>
        <TableCaption>A list of roles</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.roles.map((role) => (
            <TableRow key={role.name}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
