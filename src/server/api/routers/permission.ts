import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const permissionRouter = createTRPCRouter({
  getAllPermissions: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.ability.can("read", "Permission")) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Access denied not enough permissions",
      });
    }

    const permissions = await ctx.db.permission.findMany({
      include: { subject: true },
    });

    return { permissions };
  }),
});
