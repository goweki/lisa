export interface TemplateObj {
  [key: string]: any;
}

export type UIstate =
  | "loading"
  | "OK"
  | "expired"
  | "data-error"
  | "payment-required";
