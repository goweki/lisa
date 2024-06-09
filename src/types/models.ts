import { Institution, User, Case } from "@prisma/client";
// Define a new interface that extends the existing Institution type
export interface InstitutionType extends Institution {
  users?: UserType[];
}

export interface UserType extends User {
  institutions?: InstitutionType[];
  cases: CaseType[];
}

export interface CaseType extends Case {
  lawyer?: UserType[];
}
