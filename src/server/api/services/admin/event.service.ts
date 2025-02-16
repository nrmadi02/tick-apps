import { Prisma, TicketStatus } from "@prisma/client";
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

          // Create one ticket per category, including the quota in the category data
          const ticketData = input.categories.map((category) => ({
            eventId: event.id,
            category: {
              name: category.name,
              price: category.price,
              description: category.description,
              quota: category.quota,
            },
            status: "AVAILABLE" as TicketStatus,
          }));

          await tx.ticket.createMany({
            data: ticketData,
          });

          // Get event with total quota (sum of all category quotas)
          const eventWithTickets = await tx.event.findUniqueOrThrow({
            where: { id: event.id },
            include: {
              tickets: {
                select: {
                  category: true,
                },
              },
            },
          });

          // Calculate total quota from all categories
          const totalQuota = eventWithTickets.tickets.reduce((sum, ticket) => {
            const category = ticket.category as { quota: number };
            return sum + category.quota;
          }, 0);

          return {
            success: true,
            event: {
              ...eventWithTickets,
              _count: {
                tickets: totalQuota, // Now represents total available seats across all categories
              },
            },
            message: "Event berhasil dibuat",
          };
        },
        {
          maxWait: 1000,
          timeout: 20000,
        },
      );
    } catch (error) {
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
          thumbnail: true,
          poster: true,
          banner: true,
          status: true,
          categories: true,
          tickets: {
            select: {
              category: true,
            },
            where: {
              status: "AVAILABLE",
            },
          },
        },
        orderBy: this.buildOrderByClause(input),
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      });

      const total = await this.ctx.db.event.count({ where });

      return {
        data: events.map((event) => {
          // Calculate available tickets from remaining quota in each category
          const availableTickets = event.tickets.reduce((sum, ticket) => {
            const category = ticket.category as {
              remainingQuota: number;
            };
            return sum + Number(category.remainingQuota);
          }, 0);

          // Transform categories to include availability
          const categories = (
            event.categories as {
              name: string;
              price: number;
              quota: number;
              description?: string;
            }[]
          ).map((category) => ({
            name: category.name,
            price: category.price,
            quota: category.quota,
            description: category.description,
          }));

          // Remove tickets from the response as we've already processed them
          const { tickets, ...eventWithoutTickets } = event;
          console.log(tickets);

          return {
            ...eventWithoutTickets,
            availableTickets,
            categories,
            _count: {
              tickets: availableTickets,
            },
          };
        }),
        success: true,
        meta: this.buildPaginationMeta(total, input),
        message: "Event berhasil didapatkan",
      };
    } catch (error) {
      this.handleError(
        error as Prisma.PrismaClientKnownRequestError | TRPCError,
      );
    }
  }

  async getEvent(id: string) {
    try {
      const event = await this.ctx.db.event.findUniqueOrThrow({
        where: { id },
        include: {
          tickets: {
            where: { status: "AVAILABLE" },
          },
        },
      });

      // Calculate available tickets by summing up remainingQuota from each category
      const availableTickets = event.tickets.reduce((sum, ticket) => {
        const category = ticket.category as {
          quota: number;
          remainingQuota: number;
        };
        return sum + Number(category.remainingQuota);
      }, 0);

      // Transform categories to include availability information
      const categories = event.tickets.map((ticket) => {
        const category = ticket.category as {
          name: string;
          price: number;
          description: string;
          quota: number;
          remainingQuota: number;
        };

        return {
          name: category.name,
          price: category.price,
          quota: category.quota,
          remainingQuota: category.remainingQuota,
          description: category.description,
        };
      });

      return {
        data: {
          ...event,
          availableTickets,
          categories,
          _count: {
            tickets: availableTickets, // Update _count to reflect available tickets
          },
        },
        success: true,
        message: "Event berhasil didapatkan",
      };
    } catch (error) {
      this.handleError(
        error as Prisma.PrismaClientKnownRequestError | TRPCError,
      );
    }
  }

  async deleteEvent(id: string) {
    try {
      await this.ctx.db.event.delete({ where: { id } });

      return {
        success: true,
        message: "Event berhasil dihapus",
      };
    } catch (error) {
      this.handleError(
        error as Prisma.PrismaClientKnownRequestError | TRPCError,
      );
    }
  }

  async updateEvent(id: string, input: CreateEventRequest) {
    if (input.endDate <= input.startDate) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Date end must be greater than date start",
      });
    }

    try {
      return await this.ctx.db.$transaction(async (tx) => {
        // First, check if there are any sold tickets
        const existingTickets = await tx.ticket.findMany({
          where: {
            eventId: id,
            status: {
              in: ["SOLD", "USED"],
            },
          },
        });

        if (existingTickets.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Tidak dapat mengubah event yang sudah memiliki tiket terjual",
          });
        }

        // Update event details
        const event = await tx.event.update({
          where: { id },
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
          },
        });

        // Delete existing available tickets
        await tx.ticket.deleteMany({
          where: {
            eventId: id,
            status: "AVAILABLE",
          },
        });

        // Create new tickets with updated category information
        const ticketData = input.categories.map((category) => ({
          eventId: event.id,
          category: {
            name: category.name,
            price: category.price,
            description: category.description,
            quota: category.quota,
            remainingQuota: category.quota,
          },
          status: "AVAILABLE" as TicketStatus,
        }));

        await tx.ticket.createMany({
          data: ticketData,
        });

        // Get updated event with total available tickets
        const eventWithTickets = await tx.event.findUniqueOrThrow({
          where: { id: event.id },
          include: {
            tickets: {
              select: {
                category: true,
              },
            },
          },
        });

        // Calculate total quota from all categories
        const totalQuota = eventWithTickets.tickets.reduce((sum, ticket) => {
          const category = ticket.category as { quota: number };
          return sum + Number(category.quota);
        }, 0);

        return {
          success: true,
          event: {
            ...eventWithTickets,
            _count: {
              tickets: totalQuota,
            },
          },
          message: "Event berhasil diupdate",
        };
      });
    } catch (error) {
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
    console.error("EventService Error:", error.stack);

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
