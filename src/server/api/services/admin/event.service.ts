import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  CreateEventRequest,
  getEventsSchema,
} from "~/features/admin/event/types/admin-event.request";

import { TRPCContext } from "../../trpc";

export class AdminEventService {
  constructor(private readonly ctx: TRPCContext) {
    this.ctx = ctx;
  }

  async createEvent(input: CreateEventRequest) {
    if (input.endDate <= input.startDate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Date end must be greater than date start",
      });
    }

    try {
      return await this.ctx.db.$transaction(
        async (tx) => {
          const event = await tx.event.create({
            data: {
              name: input.name,
              description: input.description,
              startDate: input.startDate,
              endDate: input.endDate,
              venue: input.venue,
              address: input.address,
              city: input.city,
              province: input.province,
              country: input.country,
              postalCode: input.postalCode,
              coordinates: input.coordinates || [],
              categories: input.categories,
              thumbnail: input.thumbnail ?? undefined,
              banner: input.banner ?? undefined,
              poster: input.poster ?? undefined,
              status: "DRAFT",
            },
          });

          for (const category of input.categories) {
            const ticketData = Array(Number(category.quota)).fill({
              eventId: event.id,
              category: {
                name: category.name,
                price: category.price,
                description: category.description,
              },
              status: "AVAILABLE",
            });

            await tx.ticket.createMany({
              data: ticketData,
            });
          }

          const eventWithTicketCount = await tx.event.findUniqueOrThrow({
            where: { id: event.id },
            include: {
              _count: {
                select: { tickets: true },
              },
            },
          });

          return {
            success: true,
            event: eventWithTicketCount,
            message: "Event berhasil dibuat",
          };
        },
        {
          maxWait: 1000,
          timeout: 20000,
        },
      );
    } catch (error) {
      console.error("Error creating event:", error);
      this.handleError(
        error as Prisma.PrismaClientKnownRequestError | TRPCError,
      );
    }
  }

  async getEvents(input: z.infer<typeof getEventsSchema>) {
    try {
      const where = this.buildWhereClause(input);

      const events = await this.ctx.db.event.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
          venue: true,
          city: true,
          province: true,
          status: true,
          categories: true,
          _count: {
            select: {
              tickets: {
                where: {
                  status: "AVAILABLE",
                },
              },
            },
          },
        },
        orderBy: this.buildOrderByClause(input),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });

      const total = await this.ctx.db.event.count({ where });

      return {
        data: events.map((event) => ({
          ...event,
          availableTickets: event._count.tickets,
          categories: event.categories as {
            name: string;
            price: number;
          }[],
          _count: undefined,
        })),
        success: true,
        meta: this.buildPaginationMeta(total, input),
        message: "Event berhasil didapatkan",
      };
    } catch (error) {
      console.error("Error getting events:", error);
      this.handleError(
        error as Prisma.PrismaClientKnownRequestError | TRPCError,
      );
    }
  }

  private buildWhereClause(
    input: z.infer<typeof getEventsSchema>,
  ): Prisma.EventWhereInput {
    const whereCondition: Prisma.EventWhereInput = {};

    if (input.search) {
      whereCondition.OR = [
        { name: { contains: input.search, mode: "insensitive" } },
        { description: { contains: input.search, mode: "insensitive" } },
      ];
    }

    if (input.city) whereCondition.city = input.city;
    if (input.province) whereCondition.province = input.province;
    if (input.startDate) whereCondition.startDate = { gte: input.startDate };
    if (input.endDate) whereCondition.endDate = { lte: input.endDate };
    if (input.status) whereCondition.status = input.status;

    return whereCondition;
  }

  private buildOrderByClause(input: z.infer<typeof getEventsSchema>) {
    return {
      [input.sortBy === "date" ? "startDate" : input.sortBy]: input.sortOrder,
    };
  }

  private buildPaginationMeta(
    total: number,
    input: z.infer<typeof getEventsSchema>,
  ) {
    return {
      total,
      page: input.page,
      totalPages: Math.ceil(total / input.limit),
      hasMore: input.page * input.limit < total,
    };
  }

  private handleError(error: Prisma.PrismaClientKnownRequestError | TRPCError) {
    console.error("EventService Error:", error);

    if (error.code === "P2002") {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Event dengan nama tersebut sudah ada",
        cause: error,
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kesalahan pada server",
      cause: error,
    });
  }
}
