import { ReactNode } from "react";

export default function MobileLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="relative mx-auto min-h-screen max-w-lg overflow-auto border px-5">
      {children}
    </div>
  );
}
