import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: User;
  }
  interface User extends DefaultUser {
    id: string;
    email: string;
    names: string;
    systemAdmin: boolean;
    photoUrl: string | null;
    tel: string;
    role: string;
  }
}

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     /** OpenID ID Token */
//     idToken?: string;
//   }
// }
