import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { AppSidebar } from "~/components/common/app-sidebar";
import SidebarBreadcrumbs from "~/components/common/sidebar-breadcrumbs";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) return redirect("/");
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <div className="mx-auto flex w-full flex-1 flex-col p-5">
          <SidebarBreadcrumbs />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
