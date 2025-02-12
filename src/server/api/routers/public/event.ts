import { z } from "zod";

import { getEventsSchema } from "~/features/admin/event/types/admin-event.request";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const publiceEventRouter = createTRPCRouter({
  getList: publicProcedure
    .input(getEventsSchema)
    .query(async ({ ctx, input }) => {
      return await ctx.service.adminEventService.getEvents(input);
    }),
  getDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.service.adminEventService.getEvent(input.id);
    }),
});
