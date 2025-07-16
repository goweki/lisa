export type PackageName = "Basic" | "Pro" | "Enterprise";

export interface Package {
  name: PackageName;
  index?: number;
}
