import { defineAbilityFor } from "~/lib/ability";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const roleRouter = createTRPCRouter({
  getAllRoles: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user;
    const ability = defineAbilityFor(user);

    if (!ability.can("read", "Role")) {
      throw new Error("Access denied, not enough permissions");
    }

    const roles = await ctx.db.role.findMany();

    return { roles };
  }),
});
