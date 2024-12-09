import { Permission, Role, Subject } from "@prisma/client";
import { compare } from "bcrypt";
import {
  CredentialsSignin,
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: number;
      username: string;
      email: string;
      role: Role;
      permissions: (Permission & { subject: Subject })[];
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    role: Role;
  }
}

/**
 * Custom error class for handling authentication errors.
 *
 * @see https://github.com/nextauthjs/next-auth/issues/9900
 */
class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new CustomError("Invalid credentials");
          }

          const user = await db.user.findUnique({
            where: { email: credentials?.email as string },
            include: {
              role: {
                include: { permissions: { include: { subject: true } } },
              },
            },
          });

          if (!user) {
            throw new CustomError("Invalid email or password");
          }

          const passwordMatch = await compare(
            credentials.password as string,
            user.password,
          );

          if (!passwordMatch) {
            throw new CustomError("Invalid email or password");
          }

          return {
            id: String(user.id),
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: user.role.permissions,
          };
        } catch (error) {
          const err = error as CustomError;
          throw err;
        }
      },
    }),
  ],
  secret: env.AUTH_SECRET,
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    },
    jwt: ({ token, user, session }): Promise<JWT> => {
      return {
        ...token,
        ...user,
        ...session,
      };
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
} satisfies NextAuthConfig;
