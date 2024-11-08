import { ReactNode } from "react";

import Navbar from "~/components/common/navbar";
import MobileLayout from "~/components/layouts/mobile.layout";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <MobileLayout>
      <Navbar />
      {children}
    </MobileLayout>
  );
}
