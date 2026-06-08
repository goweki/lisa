"use server";

import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function findUserByKey(key: string): Promise<User | null> {
  return prisma.user.findFirst({
    where: {
      OR: [{ id: key }, { email: key }, { phone: key }],
    },
  });
}
