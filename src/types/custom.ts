import { z } from "zod";
import {
  CaseStatus,
  CaseType,
  Institution,
  User,
  Task,
  AssigneeRequest,
} from "@prisma/client"; // or your local types

export interface TemplateObj {
  [key: string]: any;
}

export type Role = "system" | "admin" | "user";

export type UIstate =
  | "loading"
  | "OK"
  | "expired"
  | "data-error"
  | "payment-required";

/*****
 *
 * INPUT
 *
 * */

export interface Input {
  value: string;
  error: string;
}

export const def_Input: Input = {
  value: "",
  error: "",
};

export const profileEditSchema = z.object({
  id: z.string().min(5),
  names: z.string().min(3).optional(),
  email: z.string().email().optional(),
  tel: z.string().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
});

export type ProfileEdit = z.infer<typeof profileEditSchema>;

export const caseInputSchema = z.object({
  status: z.enum(["OPEN", "CLOSED"]).optional(), // Adjust to match your CaseStatus enum
  clientID: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  createdBy: z.string().optional(),
  caseType: z.any().optional(),
  institution: z.any().optional(),
  lawyer: z.any().optional(),
  tasks: z.array(z.any()).optional(),
  assigneeRequests: z.array(z.any()).optional(),
});

export type CaseInput = z.infer<typeof caseInputSchema>;
