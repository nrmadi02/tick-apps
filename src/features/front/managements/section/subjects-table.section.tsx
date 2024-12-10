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

export default function SubjectsTableSection() {
  const { data, isLoading, error } = api.subject.getAllSubjects.useQuery();

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
          <p className="text-lg font-bold">Subjects</p>

          <Button>Add Subject</Button>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of subjects</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.subjects.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
