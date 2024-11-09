"use client";

import { Building2, Calendar, Pin } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";

export default function RecentSection() {
  return (
    <section className="pb-5">
      <div className="flex items-center justify-between gap-2 px-5">
        <p className="text-lg font-bold">Terbaru</p>
        <p className="text-sm font-bold text-primary">Lihat Semua</p>
      </div>
      <div className="mt-2">
        <Carousel opts={{ loop: true, dragFree: true, align: "center" }}>
          <CarouselContent className="-ml-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <CarouselItem className="basis-1/2 pl-4" key={i}>
                <Card>
                  <CardContent className="p-0">
                    <div className="flex min-h-[200px] items-center justify-center rounded bg-neutral-100">
                      <p className="text-2xl font-bold text-neutral-800">
                        Image
                      </p>
                    </div>
                    <div className="p-3 pt-2">
                      <h1 className="text-md font-bold">Judul Konten</h1>
                      <div className="mt-2 flex flex-col gap-2">
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
                  <CardFooter className="p-3">
                    <Button className="w-full">Beli Sekarang</Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
