import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

import { registerSchema } from "~/features/auth/register/types/register-request.type";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingUserByUsername = await ctx.db.user.findUnique({
        where: { username: input.username },
      });

      if (existingUserByUsername) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }

      const existingUserByEmail = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUserByEmail) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already exists",
        });
      }

      const user = await ctx.db.user.create({
        data: {
          username: input.username,
          email: input.email,
          password: await bcrypt.hash(input.password, 10),
          role: { connect: { name: "user" } },
        },
        select: { username: true, email: true },
      });

      return {
        username: user.username,
        email: user.email,
      };
    }),
});
