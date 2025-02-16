"use client";

import { format } from "date-fns";
import {
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft,
  CreditCardIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

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
import { TicketSelection } from "../types/order-request.type";

interface Ticket {
  name: string;
  price: number;
  quota: number;
  initialQuota: number;
}

interface SelectedTicket {
  name: string;
  price: number;
  quantity: number;
}

export default function EventTicketDetail() {
  const router = useRouter();
  const params = useParams() as { id: string };

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<SelectedTicket[]>([]);

  const { data: event, isLoading } = api.publicEvent.getDetail.useQuery(
    {
      id: params.id,
    },
    {
      enabled: !!params.id,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (event?.data) {
      setTickets(
        event.data.categories.map((category) => ({
          name: category.name,
          price: category.price,
          quota: category.quota,
          initialQuota: category.quota,
        })),
      );
    }
  }, [event?.data]);

  const totalPrice = useMemo(() => {
    return selectedTickets.reduce((sum, ticket) => {
      return sum + ticket.price * ticket.quantity;
    }, 0);
  }, [selectedTickets]);

  const hasSelectedTickets = useMemo(() => {
    return selectedTickets.some((ticket) => ticket.quantity > 0);
  }, [selectedTickets]);

  const getSelectedQuantity = (name: string): number => {
    const selected = selectedTickets.find((ticket) => ticket.name === name);
    return selected?.quantity || 0;
  };

  // Updated to handle both button clicks and direct input
  const updateTicketQuantity = (ticketData: Ticket, newQuantity: number) => {
    // Always ensure newQuantity is within valid range
    const validatedQuantity = Math.max(
      0,
      Math.min(newQuantity, ticketData.initialQuota),
    );

    setSelectedTickets((prev) => {
      let newSelectedTickets;

      if (validatedQuantity === 0) {
        // Remove ticket from selection
        newSelectedTickets = prev.filter((t) => t.name !== ticketData.name);
      } else if (!prev.find((t) => t.name === ticketData.name)) {
        // Add new ticket to selection
        newSelectedTickets = [
          ...prev,
          {
            name: ticketData.name,
            price: ticketData.price,
            quantity: validatedQuantity,
          },
        ];
      } else {
        // Update existing ticket quantity
        newSelectedTickets = prev.map((ticket) =>
          ticket.name === ticketData.name
            ? { ...ticket, quantity: validatedQuantity }
            : ticket,
        );
      }

      // Update available tickets quota
      setTickets((currentTickets) =>
        currentTickets.map((ticket) => {
          if (ticket.name === ticketData.name) {
            return {
              ...ticket,
              quota: ticket.initialQuota - validatedQuantity,
            };
          }
          return ticket;
        }),
      );

      return newSelectedTickets;
    });
  };

  const handleCounterTickets = (ticketData: Ticket, type: "plus" | "minus") => {
    const currentQuantity = getSelectedQuantity(ticketData.name);
    const newQuantity =
      type === "plus" ? currentQuantity + 1 : currentQuantity - 1;
    updateTicketQuantity(ticketData, newQuantity);
  };

  const handleInputChange = (ticketData: Ticket, value: string) => {
    // Remove leading zeros and any non-numeric characters
    const cleanedValue = value.replace(/^0+|[^0-9]/g, "");

    // If empty string, set to 0
    const parsedValue = cleanedValue === "" ? 0 : parseInt(cleanedValue, 10);

    // Check if the parsed value is a valid number
    if (isNaN(parsedValue)) return;

    updateTicketQuantity(ticketData, parsedValue);
  };

  const { mutateAsync, isPending } = api.publicEvent.createOrder.useMutation({
    onSuccess: () => {
      toast.success("Order created successfully");
    },
  });

  const handleChekoutTickets = async () => {
    if (!hasSelectedTickets) return;

    try {
      const response = await mutateAsync({
        eventId: params.id,
        selections: selectedTickets as unknown as TicketSelection[],
      });
      console.log("Order created:", response);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Error creating order");
    }
  };

  const handleAddToCart = () => {
    if (!hasSelectedTickets) return;
    console.log("Adding to cart:", selectedTickets);
  };

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  return (
    <div className="container mx-auto p-4">
      <div>
        <button
          onClick={() => router.back()}
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
            {tickets.map((ticket) => {
              const selectedQuantity = getSelectedQuantity(ticket.name);
              return (
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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCounterTickets(ticket, "minus")}
                      disabled={selectedQuantity === 0}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <Input
                      type="text"
                      placeholder="0"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="w-16 text-center"
                      value={selectedQuantity || ""}
                      onChange={(e) =>
                        handleInputChange(ticket, e.target.value)
                      }
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCounterTickets(ticket, "plus")}
                      disabled={ticket.quota === 0}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <p className="mb-4 text-xl font-bold">
            Total: {formatRupiah(totalPrice)}
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!hasSelectedTickets}
              size="lg"
              variant="outline"
              className="shrink-0"
            >
              <ShoppingCart className="size-10" />
            </Button>
            <Button
              onClick={handleChekoutTickets}
              disabled={!hasSelectedTickets || isPending}
              className="w-full"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <CreditCardIcon className="mr-2 size-4" />
              )}
              <span>Checkout</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
