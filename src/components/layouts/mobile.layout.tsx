import { ReactNode } from "react";

export default function MobileLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <main className="relative mx-auto min-h-screen max-w-lg overflow-auto px-5 md:border-x">
      {children}
    </main>
  );
}
