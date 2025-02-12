"use client";

import { format } from "date-fns";
import {
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  CreditCardIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { formatRupiah } from "~/lib/format";
import { api } from "~/trpc/react";

import EventDetailSkeleton from "../components/event-detail-skeleton";

export default function EventTicketDetail() {
  const router = useRouter();
  const params = useParams() as {
    id: string;
  };

  const { data: event, isLoading } = api.publicEvent.getDetail.useQuery(
    {
      id: params.id,
    },
    {
      enabled: !!params.id,
    },
  );

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        <button
          onClick={() => {
            router.back();
          }}
          className="flex items-center gap-2 font-bold"
        >
          <ArrowLeft />
          Kembali
        </button>
      </div>
      <Card className="mx-auto mt-4 w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {event?.data.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Image
            src={event?.data.thumbnail ?? "/placeholder.svg"}
            alt={event?.data.name ?? ""}
            width={400}
            height={300}
            className="h-64 w-full rounded-lg object-cover"
          />
          <p className="text-gray-600">{event?.data.description}</p>
          <div className="flex flex-col space-y-2">
            <p>
              <strong>Tanggal:</strong>{" "}
              {event?.data.startDate &&
                format(event?.data.startDate, "dd MMMM yyyy")}
            </p>
            <p>
              <strong>Waktu:</strong> 11:00 WITA
            </p>
            <p>
              <strong>Tempat:</strong> {event?.data.venue}
            </p>
          </div>
          <div className="border-t pt-4">
            <h3 className="mb-4 text-xl font-semibold">Pilih Tiket</h3>
            {event?.data.categories.map((ticket) => (
              <div
                key={ticket.name}
                className="flex items-center justify-between border-b py-2"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold">Tiket {ticket.name}</p>
                  <p className="text-sm text-gray-500">
                    Tersedia: {ticket.quota} tiket
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatRupiah(ticket.price)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon">
                    <Minus className="size-4" />
                  </Button>
                  <Input
                    type="number"
                    className="w-16 text-center"
                    min={0}
                    max={ticket.quota}
                  />
                  <Button variant="outline" size="icon">
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <p className="mb-4 text-xl font-bold">Total: Rp 100000</p>
          <div className="flex items-center gap-3">
            <Button
              // onClick={handleAddToCart}
              // disabled={total === 0}
              size={"lg"}
              variant={"outline"}
              className="shrink-0"
            >
              <ShoppingCart className="size-10" />
            </Button>
            <Button className="w-full">
              <CreditCardIcon className="mr-2 size-4" />
              Langsung Beli
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
