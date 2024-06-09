import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import prisma from "@/lib/prisma";
import { compareHash } from "@/helpers/bcryptHandlers";

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
        if (!credentials) throw new Error("no credentials to log in as");
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
        // const mongodbClient = await clientPromise; // resolve MongoClient promise
        // const db = mongodbClient.db(process.env.ATLAS_DB); //target DB
        // const collection = db.collection("users");
        //check if user exists
        let user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        //check
        // console.log(user);
        // ifCredentialsValid
        if (user && (await compareHash(password, user.password))) {
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
      // Persist role to the token right after signIn
      if (user) {
        // console.log("token here: ", user);
        token.id = user.id;
        token.role = user.role;
        token.institutionIDs = user.institutionIDs;
        token.imageUrl = user.imageUrl;
      }
      return token;
    },
    async session({ session, token }) {
      // Append role,institution to properties sent to the client
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.institutionIDs = token.institutionIDs as string[];
        session.user.imageUrl = token.imageUrl as string;
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
