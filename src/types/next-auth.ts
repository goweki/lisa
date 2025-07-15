import { DefaultUser } from "next-auth";

export interface SessionUser extends DefaultUser {
  name: string;
  systemAdmin: boolean;
  imageUrl: string | null;
}
