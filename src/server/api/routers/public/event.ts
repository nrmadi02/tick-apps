import { z } from "zod";

import { getEventsSchema } from "~/features/admin/event/types/admin-event.request";
import { createOrderSchema } from "~/features/front/event/types/order-request.type";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
  createOrder: protectedProcedure
    .input(createOrderSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return await ctx.service.orderService.createOrder(input, Number(userId));
    }),
});
