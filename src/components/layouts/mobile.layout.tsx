import { ReactNode } from "react";

export default function MobileLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main
      vaul-drawer-wrapper="true"
      className="relative mx-auto min-h-screen max-w-lg md:border-x"
    >
      {children}
    </main>
  );
}
