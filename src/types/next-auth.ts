import { DefaultUser } from "next-auth";

export interface SessionUser extends DefaultUser {
  name: string;
  systemAdmin: boolean;
  photoUrl: string | null;
  role?: "system" | "admin" | "user";
}
