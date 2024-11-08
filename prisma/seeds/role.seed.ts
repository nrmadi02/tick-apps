import { ActionType } from "@prisma/client";

import { db } from "~/server/db";

interface RoleData {
  name: string;
  description?: string;
  permissionActions: { action: string; subjectName: string }[];
}

export async function seedRoles() {
  const rolesData: RoleData[] = [
    {
      name: "admin",
      description: "Administrator with full access",
      permissionActions: [
        { action: "create", subjectName: "User" },
        { action: "read", subjectName: "User" },
        { action: "update", subjectName: "User" },
        { action: "delete", subjectName: "User" },
        { action: "create", subjectName: "Role" },
        { action: "read", subjectName: "Role" },
        { action: "update", subjectName: "Role" },
        { action: "delete", subjectName: "Role" },
        { action: "create", subjectName: "Permission" },
        { action: "read", subjectName: "Permission" },
        { action: "update", subjectName: "Permission" },
        { action: "delete", subjectName: "Permission" },
        // Tambahkan Permissions lain sesuai kebutuhan
      ],
    },
    {
      name: "user",
      description: "Regular user with limited access",
      permissionActions: [
        { action: "read", subjectName: "User" },
        { action: "update", subjectName: "User" },
        // Tambahkan Permissions lain sesuai kebutuhan
      ],
    },
    // Tambahkan Roles lain sesuai kebutuhan
  ];

  for (const role of rolesData) {
    const permissions = await Promise.all(
      role.permissionActions.map(async (perm) => {
        const permission = await db.permission.findFirst({
          where: {
            action: perm.action as ActionType,
            subject: { name: perm.subjectName },
          },
        });
        if (!permission) {
          throw new Error(
            `Permission '${perm.action}' untuk Subject '${perm.subjectName}' tidak ditemukan.`
          );
        }
        return { id: permission.id };
      })
    );

    await db.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: {
        name: role.name,
        description: role.description,
        permissions: {
          connect: permissions,
        },
      },
    });
    console.log(`Role '${role.name}' telah dibuat atau ditemukan.`);
  }
}
