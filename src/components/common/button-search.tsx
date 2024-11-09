import { Search } from "lucide-react";
import { useState } from "react";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandDialog,
} from "~/components/ui/command";

import { Button } from "../ui/button";

export default function ButtonSearch() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="ghost" size="icon">
        <Search />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Cari tiket..." />
        <CommandList>
          <CommandEmpty>Tidak ada tiket ditemukan.</CommandEmpty>
          <CommandGroup></CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
