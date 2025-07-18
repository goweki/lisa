import prisma from "../../src/lib/prisma/prisma";

export async function seedPlans() {
  const plans = [
    {
      name: "Basic",
      description: "Basic plan",
      price: 1000,
      currency: "KES",
      priceMonthly: 1000,
      priceAnnual: 10000,
      trialDays: 14,
    },
    {
      name: "Pro",
      description: "Pro plan",
      price: 2500,
      currency: "KES",
      priceMonthly: 2500,
      priceAnnual: 25000,
      trialDays: 30,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }
}
