export interface TemplateObj {
  [key: string]: any;
}

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
