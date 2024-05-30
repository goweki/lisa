import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: DefaultUser & {
      id: string;
      role: string;
      institutions: string[];
      imageUrl?: string | null;
    };
  }
  interface User extends DefaultUser {
    role: string | null;
    institutions: string[] | null;
    institutionIDs?: string[];
    imageUrl: string | null;
  }
}

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     /** OpenID ID Token */
//     idToken?: string;
//   }
// }
