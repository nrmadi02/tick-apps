import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { roleSchema } from "~/features/front/managements/types/role-request.type";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const roleRouter = createTRPCRouter({
  getAllRoles: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.ability.can("read", "Role")) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Access denied not enough permissions",
      });
    }

    const roles = await ctx.db.role.findMany();

    return { roles };
  }),

  addRole: protectedProcedure
    .input(roleSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.ability.can("create", "Role")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied not enough permissions",
        });
      }

      const role = await ctx.db.role.create({
        data: {
          name: input.name,
          description: input.description,
        },
        select: { id: true, name: true, description: true },
      });

      return {
        id: role.id,
        name: role.name,
        description: role.description,
      };
    }),

  getDetailRoleById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.ability.can("read", "Role")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied not enough permissions",
        });
      }

      const role = await ctx.db.role.findUnique({
        where: { id: input.id },
        include: { permissions: { include: { subject: true } } },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      return {
        role,
      };
    }),

  managePermissionsForRole: protectedProcedure
    .input(
      z.object({
        roleid: z.string(),
        permissionId: z.string(),
        action: z.enum(["add", "remove"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.ability.can("update", "Role")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied not enough permissions",
        });
      }

      const role = await ctx.db.role.findUnique({
        where: { id: input.roleid },
        include: { permissions: true },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      const permission = await ctx.db.permission.findUnique({
        where: { id: input.permissionId },
      });

      if (!permission) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Permission not found",
        });
      }

      const data =
        input.action === "add"
          ? { connect: { id: input.permissionId } }
          : { disconnect: { id: input.permissionId } };

      await ctx.db.role.update({
        where: { id: input.roleid },
        data: {
          permissions: data,
        },
      });
    }),

  deleteRole: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.ability.can("delete", "Role")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied not enough permissions",
        });
      }

      const role = await ctx.db.role.findUnique({
        where: { id: input.id },
      });

      if (!role) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Role not found",
        });
      }

      await ctx.db.role.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
