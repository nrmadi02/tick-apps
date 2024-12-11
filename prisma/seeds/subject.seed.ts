import { db } from "~/server/db";

interface SubjectData {
  name: string;
  description?: string;
}

export async function seedSubjects() {
  const subjectsData: SubjectData[] = [
    { name: "User", description: "User accounts and profiles" },
    { name: "Role", description: "User roles and permissions" },
    { name: "Permission", description: "System permissions" },
    { name: "Subject", description: "Subjects" }
  ];

  for (const subject of subjectsData) {
    await db.subject.upsert({
      where: { name: subject.name },
      update: { description: subject.description },
      create: {
        name: subject.name,
        description: subject.description,
      },
    });
    console.log(`Subject '${subject.name}' telah dibuat atau ditemukan.`);
  }
}
