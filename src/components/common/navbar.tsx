"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";

import { DarkModeToogle } from "./dark-mode-toggle";
import { Button } from "../ui/button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="flex items-center justify-between border-b px-5 py-4 shadow dark:border-gray-300 dark:shadow-white">
      <p className="font-bold">Tick Apps</p>
      <div>
        <DarkModeToogle />
        <Button onClick={() => setOpen(!open)} variant="ghost" size="icon">
          <Menu />
        </Button>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-2xl">Tick Apps</SheetTitle>
          </SheetHeader>
          <div className="mt-5">
            <p>Content</p>
          </div>
          <SheetFooter className="mt-10 flex-col gap-2">
            <Button>Login</Button>
            <Button variant={"outline"}>Register</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
