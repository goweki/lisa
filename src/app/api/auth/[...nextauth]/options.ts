import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma/prisma";
import { compareHash } from "@/helpers/passwordHandlers";
import { Role } from "@/types/custom";

// interface User {
//   id: string
//   name: string | null
//   email: string
//   password:string
//   image?: string | null
//   institution?:string
//   role?:string
// }

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials): Promise<any> {
        if (!credentials) throw new Error("no credentials provided");
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (!credentials) return null;
        //       /* AUTH LOGIC
        //        * logic that takes the credentials
        //        * submitted and returns either a object representing a user or value
        //        * that is false/null if the credentials are invalid.
        //        * e.g. return { id: 1, name: 'Defi Motors', email: 'contact@defioffroads.com' }
        //        * You can also use the `req` object to obtain additional parameters
        //        * (i.e., the request IP address)
        //        * check if user exists in db
        //        */

        // run query on db
        // check if user exists
        let user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        //check
        // console.log(user);
        // ifCredentialsValid

        if (
          user &&
          user.password &&
          (await compareHash(password, user.password))
        ) {
          // delete user.password;
          const { password, ...user_ } = user;
          // valid credentials
          console.log(
            `\n.............\nSUCCESS: User authenticated\n > ${JSON.stringify(
              user_
            )}`
          );
          return user_;
        } else {
          // invalid credentials
          console.error(
            ` FAILED: Invalid credentials\n > by ${JSON.stringify(
              credentials
            )}\n`
          );
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Persist role to the token right after signIn
        console.log("user obj - ", user);
        token.id = user.id;
        token.name = user.names?.split(" ")[0];
        token.systemAdmin = user.systemAdmin;
        token.photoUrl = user.photoUrl;
        // embed role in token
        let userRole_: Role = "user";
        if (user.systemAdmin) {
          userRole_ = "system";
        } else {
          const isAdmin_ = !!(await prisma.institutionUser.findFirst({
            where: {
              userId: user.id,
              role: "ADMIN",
            },
          }));
          if (isAdmin_) {
            userRole_ = "admin";
          }
        }
        token.role = userRole_;
      }
      return token;
    },
    async session({ session, token }) {
      // append additional properties sent to the client
      if (session.user) {
        session.user.id = token.id as string;
        session.user.systemAdmin = token.systemAdmin as boolean;
        session.user.photoUrl = token.photoUrl as string;
        session.user.role = token.role as Role;
      }
      // console.log("session here: ", session);
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    //signOut: "/auth/signout",
    //error: "/auth/error", // Error code passed in query string as ?error=
    //verifyRequest: "/auth/verify-request", // (used for check email message)
    //newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
};
