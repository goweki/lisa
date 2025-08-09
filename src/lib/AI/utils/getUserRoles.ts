import type { UserContext } from "../types/UserContext";

export function getUserRoles(user: UserContext): string[] {
  const roles: string[] = [];

  // System admin flag
  if (user.systemAdmin) {
    roles.push("SYSTEM_ADMIN");
    return roles;
  }

  // institution roles
  for (const institution of user.institutions) {
    if (institution.role === "ADMIN") {
      roles.push(`ADMIN of institution with id ${institution.id}`);
    } else {
      roles.push(`USER of institution with id ${institution.id}`);
    }
  }

  return roles;
}
