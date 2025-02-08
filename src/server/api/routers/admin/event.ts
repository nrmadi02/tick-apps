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
});
