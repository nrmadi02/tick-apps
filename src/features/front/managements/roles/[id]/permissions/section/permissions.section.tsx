"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function PermissionsSection({ roleId }: { roleId: string }) {
  const {
    data: role,
    isLoading: isLoadingRole,
    error: errorRole,
  } = api.role.getDetailRoleById.useQuery({ id: roleId });
  const {
    data: subjects,
    isLoading: isLoadingSubjects,
    error: errorSubjects,
  } = api.subject.getAllSubjects.useQuery();
  const {
    data: permissions,
    isLoading: isLoadingPermissions,
    error: errorPermissions,
  } = api.permission.getAllPermissions.useQuery();

  if (isLoadingRole || isLoadingSubjects || isLoadingPermissions) {
    return <div>Loading...</div>;
  }

  if (errorRole || errorSubjects || errorPermissions) {
    return <div>Error loading data. Please try again later.</div>;
  }

  if (!role || !subjects || !permissions) {
    return <div>No data available.</div>;
  }

  return (
    <Card className="m-2">
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {subjects.subjects.map((subject) => (
          <Card key={subject.id} className="">
            <CardHeader>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-4">
              {permissions.permissions
                .filter((permission) => permission.subjectId === subject.id)
                .map((permission) => {
                  const hasPermission = role.role.permissions.some(
                    (rolePermission) => rolePermission.id === permission.id,
                  );

                  return (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={permission.id}
                        checked={hasPermission}
                      />
                      <Label htmlFor={permission.id} className="ml-2">
                        {permission.action}
                      </Label>
                    </div>
                  );
                })}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
