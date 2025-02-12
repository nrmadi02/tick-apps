"use client";

import { format } from "date-fns";
import { Building2, Calendar, Pin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { formatRupiah } from "~/lib/format";
import { getLowestPrice } from "~/lib/get-lower-price";
import { api } from "~/trpc/react";

import SkeletonEventRecommendationCard from "../components/skeleton-event-recommendation.card";

export default function RecommendationSection() {
  const { data, isLoading } = api.publicEvent.getList.useQuery({
    limit: 3,
    page: 1,
  });

  if (isLoading) {
    return (
      <section className="p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-lg font-bold">Rekomendasi</p>
        </div>
        <div className="mt-5 flex flex-col gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonEventRecommendationCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-lg font-bold">Rekomendasi</p>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {data?.data.map((event, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              {!event.thumbnail && (
                <div className="flex min-h-[300px] items-center justify-center rounded bg-neutral-100">
                  <p className="text-2xl font-bold text-neutral-800">Image</p>
                </div>
              )}
              {event.thumbnail && (
                <Image
                  src={event.thumbnail}
                  alt={event.name}
                  width={200}
                  height={200}
                  className="max-h-[300px] w-full rounded bg-neutral-100 object-cover"
                />
              )}
              <div className="mt-2 p-3">
                <h1 className="text-lg font-bold">{event.name}</h1>
                <p className="text-sm">{event.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <p className="text-sm">
                      {format(event.startDate, "dd MMMM yyyy")} -{" "}
                      {format(event.endDate, "dd MMMM yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Pin className="size-4" />
                    <p className="text-sm">{event.city}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="size-4" />
                    <p className="text-sm">{event.venue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2 p-3">
              <p className="break-words text-sm font-semibold">
                Mulai dari {formatRupiah(getLowestPrice(event.categories))}
              </p>
              <Link href={`/event/${event.id}/detail`}>
                <Button>Beli Sekarang</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
