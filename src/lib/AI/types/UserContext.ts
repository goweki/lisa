import { User, UserRole } from "@prisma/client";

export type UserContext = User & {
  institutions: {
    id: string;
    name: string;
    role: UserRole;
  }[];
};
