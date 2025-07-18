import { Prisma } from "@prisma/client";
import prisma from "../../src/lib/prisma/prisma";

export async function seedFeatures() {
  const features = [
    {
      name: "Open/High/Low/Close",
      description: "Basic case metrics and timelines",
      limits: { maxCases: 100, maxUsers: 10 },
      plans: ["Basic", "Pro"],
    },
    {
      name: "Case Reminders",
      description: "Automated email and dashboard reminders",
      limits: Prisma.JsonNull,
      plans: ["Pro"],
    },
  ];

  for (const feature of features) {
    const createdFeature = await prisma.feature.upsert({
      where: { name: feature.name },
      update: {
        name: feature.name,
        description: feature.description,
        limits: feature.limits,
        isActive: true,
      },
      create: {
        name: feature.name,
        description: feature.description,
        limits: feature.limits,
        isActive: true,
      },
    });

    for (const planName of feature.plans) {
      const plan = await prisma.plan.findUnique({ where: { name: planName } });
      if (!plan) continue;

      await prisma.planFeature.upsert({
        where: {
          planId_featureId: {
            planId: plan.id,
            featureId: createdFeature.id,
          },
        },
        update: {
          limits: feature.limits,
        },
        create: {
          planId: plan.id,
          featureId: createdFeature.id,
          limits: feature.limits,
        },
      });
    }
  }
}
