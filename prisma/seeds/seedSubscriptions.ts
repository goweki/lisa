import prisma from "../../src/lib/prisma/prisma";

export async function seedSubscriptions() {
  const institution = await prisma.institution.findUnique({
    where: { name: "Justice League" },
  });
  const plan = await prisma.plan.findUnique({ where: { name: "Pro" } });

  if (institution && plan) {
    const now = new Date();
    await prisma.subscription.create({
      data: {
        institutionId: institution.id,
        planId: plan.id,
        status: "ACTIVE",
        currentPeriodStart: now,
        currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }
}
