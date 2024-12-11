import { ActionType } from "@prisma/client";

import { db } from "~/server/db";

interface PermissionData {
  action: ActionType;
  subjectName: string;
  description?: string;
}

export async function seedPermissions() {
  const permissionsData: PermissionData[] = [
    // Permissions untuk User
    { action: "create", subjectName: "User", description: "Create a user" },
    { action: "read", subjectName: "User", description: "Read user details" },
    {
      action: "update",
      subjectName: "User",
      description: "Update user information",
    },
    { action: "delete", subjectName: "User", description: "Delete a user" },

    // Permissions untuk Role
    { action: "create", subjectName: "Role", description: "Create a role" },
    { action: "read", subjectName: "Role", description: "Read role details" },
    {
      action: "update",
      subjectName: "Role",
      description: "Update role information",
    },
    { action: "delete", subjectName: "Role", description: "Delete a role" },

    // Permissions untuk Permission
    {
      action: "create",
      subjectName: "Permission",
      description: "Create a permission",
    },
    {
      action: "read",
      subjectName: "Permission",
      description: "Read permission details",
    },
    {
      action: "update",
      subjectName: "Permission",
      description: "Update permission information",
    },
    {
      action: "delete",
      subjectName: "Permission",
      description: "Delete a permission",
    },

    // Permissions untuk Subject
    {
      action: "create",
      subjectName: "Subject",
      description: "Create a subject",
    },
    {
      action: "read",
      subjectName: "Subject",
      description: "Read subject details",
    },
    {
      action: "update",
      subjectName: "Subject",
      description: "Update subject information",
    },
    {
      action: "delete",
      subjectName: "Subject",
      description: "Delete a subject",
    },
    // Tambahkan Permissions lain sesuai kebutuhan
  ];

  for (const perm of permissionsData) {
    const subject = await db.subject.findUnique({
      where: { name: perm.subjectName },
    });

    if (!subject) {
      throw new Error(
        `Subject dengan nama '${perm.subjectName}' tidak ditemukan.`,
      );
    }

    await db.permission.upsert({
      where: {
        action_subjectId: {
          action: perm.action,
          subjectId: subject.id,
        },
      },
      update: { description: perm.description },
      create: {
        action: perm.action,
        subjectId: subject.id,
        description: perm.description,
      },
    });
    console.log(
      `Permission '${perm.action}' untuk Subject '${perm.subjectName}' telah dibuat atau ditemukan.`,
    );
  }
}
