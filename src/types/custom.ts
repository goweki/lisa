import { z } from "zod";

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
