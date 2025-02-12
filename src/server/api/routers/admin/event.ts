import { z } from "zod";

import {
  createEventSchema,
  getEventsSchema,
} from "~/features/admin/event/types/admin-event.request";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const adminEventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.service.adminEventService.createEvent(input);
    }),
  getList: protectedProcedure
    .input(getEventsSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.service.adminEventService.getEvents(input);
    }),
  getDetail: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.service.adminEventService.getEvent(input.id);
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), input: createEventSchema }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.service.adminEventService.updateEvent(
        input.id,
        input.input,
      );
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.service.adminEventService.deleteEvent(input.id);
    }),
});
