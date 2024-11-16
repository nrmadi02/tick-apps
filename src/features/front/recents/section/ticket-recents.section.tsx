import { Building2, Calendar, Pin } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";

export default function TicketRecentsSection() {
  return (
    <section className="p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-bold">Tiket</p>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <div className="flex min-h-[200px] items-center justify-center rounded bg-neutral-100">
                <p className="text-2xl font-bold text-neutral-800">Image</p>
              </div>
              <div className="mt-2 p-3">
                <h1 className="text-lg font-bold">Judul Konten</h1>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <p className="text-sm">Tanggal</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Pin className="size-4" />
                    <p className="text-sm">Lokasi</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="size-4" />
                    <p className="text-sm">Enterprise</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 p-3">
              <p className="break-words text-sm font-semibold">
                Mulai dari Rp100.000
              </p>
              <Button>Beli Sekarang</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
