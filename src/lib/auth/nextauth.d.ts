import { DefaultSession } from "next-auth";
import { UserRole, UserStatus } from "../prisma/generated/enums";

declare module "next-auth" {
  // This extends the User object returned by the adapter/database
  interface User {
    systemAdmin: boolean;
    status: UserStatus;
    tel: string | null;
  }

  interface Session {
    user: {
      systemAdmin: boolean;
      status: UserStatus;
      tel: string | null;
      role: "system" | "admin" | "user";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    systemAdmin: boolean;
    status: UserStatus;
    tel: string | null;
  }
}
