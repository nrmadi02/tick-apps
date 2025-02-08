import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";

export default function ListEventSection() {
  return (
    <div className="pt-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Management Event</h1>
          <p>List of event</p>
        </div>
        <Link href="/admin/event/add">
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Add Event
          </Button>
        </Link>
      </div>
    </div>
  );
}
