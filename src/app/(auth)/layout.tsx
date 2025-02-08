import { redirect } from "next/navigation";
import { ReactNode } from "react";

import MobileLayout from "~/components/layouts/mobile.layout";
import { auth } from "~/server/auth";

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();
  if (session) redirect("/");
  return <MobileLayout>{children}</MobileLayout>;
}
