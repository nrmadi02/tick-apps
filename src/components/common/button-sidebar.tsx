// eslint-disable-next-line import/order
import { Menu } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function ButtonSidebar() {
  const session = useSession();

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
          {session.status === "unauthenticated" && (
            <><Button asChild>
              <Link href="/login">Login</Link>
            </Button><Button variant={"outline"}>
                <Link href="/register">Register</Link>
              </Button></>
          )}
          {session.status === "authenticated" && (
            <Button onClick={() => signOut()}>
              Logout
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
