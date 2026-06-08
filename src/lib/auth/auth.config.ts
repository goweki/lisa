// import GitHub from "next-auth/providers/github";
// import type { NextAuthConfig } from "next-auth";

// export default { providers: [GitHub] } satisfies NextAuthConfig;

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compareHash } from "@/lib/utils/passwordHandlers";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { EntityStatus, UserRole } from "@prisma/client";
import prisma from "../prisma";
import { findUserByKey } from "@/actions/user.actions";

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV !== "production",
  session: { strategy: "jwt" },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
    }),
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username as string;
        const password = credentials.password as string;

        console.log(`User attempting login: ${username}`);

        const user = await findUserByKey(username);

        if (!user) {
          return null;
        }

        if (!user.passwordHash) {
          console.warn(` > User password not set`);
          return null;
        }

        if (user.status === EntityStatus.SUSPENDED) {
          console.warn(` > User status: SUSPENDED`);
          return null;
        }

        const isValid = await compareHash(password, user.passwordHash);

        if (!isValid) {
          console.log(` > User credentials invalid`);
          return null;
        }

        console.log(` > User authenticated.`);

        if (user.status !== EntityStatus.ACTIVE) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              status: EntityStatus.ACTIVE,
            },
          });
        }

        return {
          id: user.id,
          systemAdmin: user.systemAdmin,
          email: user.email,
          tel: user.tel,
          name: user.names,
          status: user.status,
          image: user.photoUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const user_ = await prisma.user.findUniqueOrThrow({
          where: { id: user.id },
          include: { institutions: true },
        });

        token.id = user.id;
        token.status = user.status;
        token.role = user.l67567;
        token.tel = user.tel;
      }
      return { ...token, ...session };
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.status = token.status as EntityStatus;
        session.user.systemAdmin = token.systemAdmin as boolean;
        session.user.tel = token.tel as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
};

export default authConfig;
