// eslint-disable-next-line import/order
import { Menu } from "lucide-react";
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
          <Button>Login</Button>
          <Button variant={"outline"}>Register</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
