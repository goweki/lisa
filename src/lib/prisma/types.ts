import {
  User as _User,
  Institution as _Institution,
  Case as _Case,
  CaseType as _CaseType,
  Task as _Task,
  Document as _Document,
} from "@prisma/client";

// extends the User type to include the Institutions relation
export type User = _User & {
  institutions?: _Institution[];
};

export function isUser(obj: any): obj is User {
  return (
    // typeof obj === 'object' &&
    // obj !== null &&
    // typeof obj.id === 'number' &&
    // typeof obj.name === 'string' &&
    // typeof obj.constituencyId === 'string' &&
    // typeof obj.party === 'string'
    // Add other property checks as needed

    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("email") &&
    obj.hasOwnProperty("role") &&
    obj.hasOwnProperty("institutionIDs")
  );
}

// extends the Institution type to include the relations
export type Institution = _Institution & {
  users?: _User[];
  cases?: _Case[];
  caseTypes?: _CaseType[];
};

export function isInstitution(obj: any): obj is Institution {
  return (
    // typeof obj === 'object' &&
    // obj !== null &&
    // typeof obj.id === 'number' &&
    // typeof obj.name === 'string' &&
    // typeof obj.constituencyId === 'string' &&
    // typeof obj.party === 'string'
    // Add other property checks as needed

    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("userIDs") &&
    obj.hasOwnProperty("cases")
  );
}

// extends the Case type to include the relations
export type Case = _Case & {
  caseType?: _CaseType;
  institution?: _Institution;
  lawyer?: _User;
};

export function isCase(obj: any): obj is Case {
  return (
    // typeof obj === 'object' &&
    // obj !== null &&
    // typeof obj.id === 'number' &&
    // typeof obj.name === 'string' &&
    // typeof obj.constituencyId === 'string' &&
    // typeof obj.party === 'string'
    // Add other property checks as needed

    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("status") &&
    obj.hasOwnProperty("clientParty") &&
    obj.hasOwnProperty("clientName")
  );
}

// extends the Case type to include the relations
export type Task = _Task & {
  completedBy?: _User;
  documents?: _Document[];
  case?: _Case;
};

export function isTask(obj: any): obj is Task {
  return (
    // typeof obj === 'object' &&
    // obj !== null &&
    // typeof obj.id === 'number' &&
    // typeof obj.name === 'string' &&
    // typeof obj.constituencyId === 'string' &&
    // typeof obj.party === 'string'
    // Add other property checks as needed

    obj !== null &&
    typeof obj === "object" &&
    obj.hasOwnProperty("name") &&
    obj.hasOwnProperty("type") &&
    obj.hasOwnProperty("dueDate") &&
    obj.hasOwnProperty("caseID")
  );
}
