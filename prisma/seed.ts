import { db } from "~/server/db";

import { seedPermissions } from "./seeds/permission.seed";
import { seedRoles } from "./seeds/role.seed";
import { seedSubjects } from "./seeds/subject.seed";
import { seedUsers } from "./seeds/user.seed";

async function main() {
  await seedSubjects();
  await seedPermissions();
  await seedRoles();
  await seedUsers();

  console.log("Semua data seed telah berhasil di-inisialisasi.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
