import { Menu } from "lucide-react";
import Link from "next/link";

import { auth } from "~/server/auth";

import ButtonLogout from "./button-logout";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default async function ButtonSidebar() {
  const session = await auth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="z-[102] flex flex-col justify-between"
      >
        <div>
          <SheetHeader>
            <SheetTitle className="text-left text-2xl">Tick Apps</SheetTitle>
          </SheetHeader>
          <p>List Menu</p>
        </div>
        <SheetFooter className="mt-10 flex-col gap-2">
          {!session && (
            <>
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant={"outline"}>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
          {session && (
            <ButtonLogout />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
