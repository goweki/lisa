import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  cleanUsers;
}

// ---------------- SEED FUNCTIONS ----------------

async function cleanUsers(prisma_: PrismaClient): Promise<User[]> {
  const users: User[] = [];
  return users;
}
