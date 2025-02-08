"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";

export default function SidebarBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbItems = pathname
    .split("/")
    .filter((item) => item !== "")
    .map((item, index, arr) => {
      const path = arr.slice(0, index + 1).join("/");

      return {
        path: path === "admin" ? "admin/home" : path,
        name: item,
      };
    });

  return (
    <div className="flex items-center gap-3 border-b border-gray-300 pb-2">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage className="capitalize">
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="capitalize">
                    <Link href={`/${item.path}`}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index !== breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
