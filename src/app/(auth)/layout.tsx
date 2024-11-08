import { ReactNode } from "react";

import MobileLayout from "~/components/layouts/mobile.layout";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <MobileLayout>{children}</MobileLayout>;
}
