// prisma/seed/users.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

interface UserData {
  email: string;
  password: string;
  username: string;
  roleName: string;
}

export async function seedUsers() {
  const usersData: UserData[] = [
    {
      email: "admin@admin.com",
      password: "password",
      username: "admin",
      roleName: "admin",
    },
    {
      email: "user@user.com",
      password: "password",
      username: "user",
      roleName: "user",
    },
  ];

  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        email: user.email,
        password: hashedPassword,
        username: user.username,
        verifiedAt: new Date(),
        role: {
          connect: { name: user.roleName },
        },
      },
      create: {
        email: user.email,
        password: hashedPassword,
        username: user.username,
        verifiedAt: new Date(),
        role: {
          connect: { name: user.roleName },
        },
      },
    });
    console.log(`User '${user.email}' telah dibuat atau diperbarui.`);
  }
}
