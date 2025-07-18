import prisma from "../../src/lib/prisma/prisma";

export async function seedUsers() {
  const users = [
    { names: "Lisa1 System Test", email: "lisa1@goweki.com" },
    { names: "lisa2 Admin Test", email: "lisa2@goweki.com" },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
}
