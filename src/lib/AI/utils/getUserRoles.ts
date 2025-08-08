import type { UserContext } from "../types/UserContext";

export function getUserRoles(user: UserContext): string[] {
  const permissions: string[] = [];

  // System admin flag
  if (user.systemAdmin) {
    permissions.push("SYSTEM_ADMIN");
    return permissions;
  }

  // institution roles
  for (const institution of user.institutions) {
    if (institution.role === "ADMIN") {
      permissions.push(
        JSON.stringify({ role: "ADMIN", institution_id: institution.id })
      );
    } else {
      permissions.push(
        JSON.stringify({ role: "USER", institution_id: institution.id })
      );
    }
  }

  return permissions;
}
