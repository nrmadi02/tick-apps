import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const subjectRouter = createTRPCRouter({
  getAllSubjects: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.ability.can("read", "Permission")) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Access denied not enough permissions",
      });
    }

    const subjects = await ctx.db.subject.findMany();

    return { subjects };
  }),
});
