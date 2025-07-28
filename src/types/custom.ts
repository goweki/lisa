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
  id: z.string().min(3).optional(),
  name: z.string().min(3).optional(),
  description: z.string().optional(),
  caseTypeId: z.string().min(3).optional(),
  caseNumber: z.string().min(3).optional(),
  institutionId: z.string().min(3).optional(),
  assigneeId: z.string().min(3).optional(),
  clientIdNumber: z.string().min(3).optional(),
  clientEmail: z.string().min(3).optional(),
  clientParty: z.string().min(3).optional(),
  clientName: z.string().min(3).optional(),
  clientTel: z.string().min(3).optional(),
});

export type CaseInput = z.infer<typeof caseInputSchema>;

export const taskInputSchema = z.object({
  id: z.string().min(3).optional(),
  name: z.string().min(3).optional(),
  type: z.any().optional(),
  caseId: z.string().min(3).optional(),
  dueDate: z.string().min(3).optional(),
  description: z.string().optional(),
  reminders: z.any().optional(),
});

export type taskInput = z.infer<typeof taskInputSchema>;

