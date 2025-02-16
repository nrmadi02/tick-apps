import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { CreateOrderInput } from "~/features/front/event/types/order-request.type";

import { TRPCContext } from "../trpc";

interface TicketSelection {
  name: string;
  price: string;
  quantity: number;
}

export class OrderService {
  constructor(private readonly ctx: TRPCContext) {
    this.ctx = ctx;
  }

  async createOrder(input: CreateOrderInput, userId: number) {
    try {
      return await this.ctx.db.$transaction(async (tx) => {
        // Get event with categories and tickets
        const event = await tx.event.findUniqueOrThrow({
          where: { id: input.eventId },
          select: {
            id: true,
            name: true,
            categories: true,
            tickets: {
              where: {
                status: "AVAILABLE",
              },
              select: {
                id: true,
                category: true,
                status: true,
              },
            },
          },
        });

        const categories = event.categories as {
          name: string;
          price: string;
          quota: number;
          remainingQuota: number;
          description: string;
        }[];

        let total = 0;
        const ticketsToReserve: { ticketIds: string[] }[] = [];

        // Validate selections
        for (const selection of input.selections) {
          // 1. Validate category exists
          const category = categories.find(
            (cat) => cat.name === selection.name,
          );
          if (!category) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Kategori tiket "${selection.name}" tidak ditemukan`,
            });
          }

          // 2. Validate price matches
          if (category.price !== selection.price) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Harga tiket tidak sesuai untuk kategori "${selection.name}"`,
            });
          }

          // 3. Validate quantity is positive
          if (selection.quantity <= 0) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Jumlah tiket harus lebih dari 0`,
            });
          }

          // 4. Validate against remaining quota
          if (category.remainingQuota < selection.quantity) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `Stok tiket "${selection.name}" tidak mencukupi (Tersedia: ${category.remainingQuota}, Diminta: ${selection.quantity})`,
            });
          }

          // Get available tickets for this category
          const availableTickets = event.tickets.filter(
            (ticket) =>
              (ticket.category as unknown as TicketSelection).name ===
              selection.name,
          );

          // Calculate total
          total += Number(category.price) * selection.quantity;

          // Get ticket IDs to reserve
          const ticketIds = availableTickets
            .slice(0, selection.quantity)
            .map((ticket) => ticket.id);

          ticketsToReserve.push({ ticketIds });
        }

        // Create order
        const order = await tx.order.create({
          data: {
            userId,
            total,
            status: "PENDING",
            ticketDetails: input.selections,
            tickets: {
              connect: ticketsToReserve.flatMap((r) =>
                r.ticketIds.map((id) => ({ id })),
              ),
            },
          },
        });

        // Get complete order
        const completeOrder = await tx.order.findUniqueOrThrow({
          where: { id: order.id },
          include: {
            tickets: {
              include: {
                event: {
                  select: {
                    name: true,
                    startDate: true,
                    endDate: true,
                    venue: true,
                    categories: true,
                  },
                },
              },
            },
          },
        });

        return {
          success: true,
          order: completeOrder,
          message: "Order berhasil dibuat",
        };
      });
    } catch (error) {
      this.handleError(
        error as Prisma.PrismaClientKnownRequestError | TRPCError,
      );
    }
  }

  private handleError(error: Prisma.PrismaClientKnownRequestError | TRPCError) {
    console.error("EventService Error:", error.stack);

    if (error.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Event dengan nama tersebut sudah ada",
        cause: error,
      });
    }

    throw error;
  }
}
