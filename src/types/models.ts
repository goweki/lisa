import {
  User as _User,
  Institution as _Institution,
  Case as _Case,
  CaseType as _CaseType,
  Task as _Task,
  Document as _Document,
  InstitutionUser as _InstitutionUser,
  Plan as _Plan,
  PlanFeature as _PlanFeature,
  Subscription as _Subscription,
  Feature as _Feature,
  Message,
} from "@prisma/client";

export interface Plan extends _Plan {
  planFeatures?: _PlanFeature[];
  subscriptions?: _Subscription[];
}

export interface PlanFeature extends _PlanFeature {
  feature?: _Feature;
}

export interface Institution extends _Institution {
  users?: _User[];
  cases?: _Case[];
  caseTypes?: _CaseType[];
}

export interface InstitutionUser extends _InstitutionUser {
  institution?: _Institution;
}

export function isInstitution(obj: any): obj is Institution {
  if (obj === null || typeof obj !== "object") return false;
  const allowedKeys = ["id", "name", "location", "logoUrl"];
  const keys = Object.keys(obj);
  if (!keys.every((k) => allowedKeys.includes(k))) return false;

  return (
    typeof obj.name === "string" &&
    typeof obj.location === "string" &&
    (obj.id === undefined || typeof obj.id === "string") &&
    (obj.logoUrl === undefined || typeof obj.logoUrl === "string")
  );
}

export interface User extends _User {
  institutions?: _InstitutionUser[];
  cases?: _Case[];
  messages?: Message[];
}

export function isUser(obj: any): obj is User {
  return (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("email") &&
    obj.hasOwnProperty("role") &&
    obj.hasOwnProperty("institutionIDs")
  );
}

export interface Case extends _Case {
  caseType?: _CaseType;
  institution?: _Institution;
  assignee?: _User;
  tasks?: _Task[];
}

export function isCase(obj: any): obj is Case {
  return (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("status") &&
    obj.hasOwnProperty("clientParty") &&
    obj.hasOwnProperty("clientName")
  );
}

export interface Task extends _Task {
  completedBy?: _User;
  documents?: _Document[];
  case?: _Case;
}

export function isTask(obj: any): obj is Task {
  return (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("type") &&
    obj.hasOwnProperty("dueDate") &&
    obj.hasOwnProperty("caseID")
  );
}
