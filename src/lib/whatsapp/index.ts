import "server-only";

import { LociClient } from "./client";
import { env_ } from "./env-variables";

const loci_whatsapp = new LociClient(env_);

export default loci_whatsapp;
