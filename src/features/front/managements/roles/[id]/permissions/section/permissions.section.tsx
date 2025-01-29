"use client";

import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function PermissionsSection({ roleId }: { roleId: string }) {
  const {
    data: role,
    isLoading: isLoadingRole,
    error: errorRole,
    refetch: refetchRole,
    isFetching: isFetchingRole,
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

  const { mutate, isPending } = api.role.managePermissionsForRole.useMutation({
    onSuccess: () => {
      refetchRole();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

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
        <CardTitle>Permissions - {role.role.name}</CardTitle>
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
                      {(isPending || isFetchingRole) && (
                        <LoaderCircle className="size-4 animate-spin text-primary" />
                      )}

                      {!isPending && !isFetchingRole && (
                        <Checkbox
                          id={permission.id}
                          checked={hasPermission}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              mutate({
                                roleid: roleId,
                                permissionId: permission.id,
                                action: "add",
                              });
                            } else {
                              mutate({
                                roleid: roleId,
                                permissionId: permission.id,
                                action: "remove",
                              });
                            }
                          }}
                        />
                      )}
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
