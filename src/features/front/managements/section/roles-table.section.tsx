"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

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
    <Card className="m-5">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-bold">Roles</p>

          <Button>Add Role</Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of roles</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.roles.map((role) => (
              <TableRow key={role.name}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell className="text-center">
                  <Link href={`/managements/roles/${role.id}/permissions`}>
                    <Button title="View" size="icon">
                      <Eye />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
