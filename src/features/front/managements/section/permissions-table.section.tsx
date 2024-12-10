"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
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

export default function PermissionsTableSection() {
  const { data, isLoading, error } =
    api.permission.getAllPermissions.useQuery();

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
    <Card className="m-5">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-bold">Permissions</p>

          <Button>Add Permission</Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of permissions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Action</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">
                  {permission.action}
                </TableCell>
                <TableCell>{permission.subject.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
