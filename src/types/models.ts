import {
  User as _User,
  Institution as _Institution,
  Case as _Case,
  CaseType as _CaseType,
  Task as _Task,
  Document as _Document,
} from "@prisma/client";

export interface Institution extends _Institution {
  users?: _User[];
  cases?: _Case[];
  caseTypes?: _CaseType[];
}

export function isInstitution(obj: any): obj is Institution {
  return (
    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("userIDs") &&
    obj.hasOwnProperty("cases")
  );
}

export interface User extends _User {
  institutions?: _Institution[];
  cases?: _Case[];
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
  lawyer?: _User;
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
