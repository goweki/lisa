import { UserContext } from "../types/UserContext";

type UserPermissions = {
  isSystemAdmin: boolean;
  canMakeSystemChanges: boolean;
  institutions: {
    id: string;
    name: string;
    role: string;
    canCreateCases: boolean;
    canEditInstitution: boolean;
  }[];
};

export function getUserPermissions(user: UserContext): UserPermissions {
  return {
    isSystemAdmin: user.systemAdmin,
    canMakeSystemChanges: user.systemAdmin,
    institutions: user.institutions.map((inst) => ({
      id: inst.id,
      name: inst.name,
      role: inst.role,
      canCreateCases: true,
      canEditInstitution: inst.role === "ADMIN",
    })),
  };
}
