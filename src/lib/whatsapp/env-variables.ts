import "server-only";

import z from "zod";

export interface LociClientEnv {
  baseUrl: string;
  apiKey: string;
}

export const EnvSchema = z.object({
  LOCI_BASE_URL: z.string().min(4),
  LOCI_API_KEY: z.string().min(4),
});

const env = EnvSchema.parse(process.env);

export const env_: LociClientEnv = {
  baseUrl: env.LOCI_BASE_URL,
  apiKey: env.LOCI_API_KEY,
};
