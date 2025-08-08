import type { UserContext } from "../types/UserContext";

export function getUserPermissions(user: UserContext): string[] {
  const permissions: string[] = [];

  // System admin flag
  if (user.systemAdmin) {
    permissions.push("SYSTEM_ADMIN");
  }

  // Users in any institution can create cases
  if (user.institutions.length > 0) {
    permissions.push("CREATE_CASE");
  }

  for (const institution of user.institutions) {
    if (institution.role === "ADMIN") {
      permissions.push(`EDIT_INSTITUTION:${institution.id}`);
    }
  }

  // You could also include a general flag:
  if (permissions.some((p) => p.startsWith("EDIT_INSTITUTION:"))) {
    permissions.push("CAN_EDIT_SOME_INSTITUTION");
  }

  return permissions;
}
