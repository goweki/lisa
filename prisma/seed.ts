import {
  PrismaClient,
  Plan,
  Feature,
  User,
  Institution,
  UserRole,
  SubscriptionStatus,
  EntityStatus,
  ContentStatus,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // if (process.env.NODE_ENV === "development") {
  //   console.log("♻️ Clearing existing data...");
  //   await clearTables(prisma);
  //   console.log("✅ Tables cleared");
  // }

  console.log("🌱 Starting database seeding...");

  const plans = await seedPlans(prisma);
  const features = await seedFeatures(prisma);
  await seedPlanFeatures(prisma, plans, features);

  // const institutions = await seedInstitutions(prisma);
  // const users = await seedUsers(prisma);

  // await seedInstitutionUsers(prisma, users, institutions);
  // await seedSubscriptions(prisma, institutions, plans);

  // await seedBlog(prisma, users);

  console.log("✅ Seeding complete.");
}

// ---------------- SEED FUNCTIONS ----------------

async function seedPlans(prisma_: PrismaClient): Promise<Plan[]> {
  const plans: Omit<Plan, "id" | "createdAt" | "updatedAt" | "isActive">[] = [
    {
      name: "starter",
      description: "Starter package for small firms",
      price: 5000,
      priceMonthly: 5000,
      priceAnnual: 50000,
      currency: "KES",
      trialDays: 14,
    },
    {
      name: "team",
      description: "For growing teams with collaboration features",
      price: 15000,
      priceMonthly: 15000,
      priceAnnual: 150000,
      currency: "KES",
      trialDays: 30,
    },
    {
      name: "enterprise",
      description: "Full-scale access and support",
      price: 50000,
      priceMonthly: 50000,
      priceAnnual: 500000,
      currency: "KES",
      trialDays: 30,
    },
  ];

  const result: Plan[] = [];
  for (const plan of plans) {
    const created = await prisma_.plan.upsert({
      where: { name: plan.name },
      update: {},
      create: {
        ...plan,
        isActive: true,
      },
    });
    result.push(created);
  }

  console.log(`📝 Seeded ${result.length} plans`);
  return result;
}

async function seedFeatures(prisma_: PrismaClient): Promise<Feature[]> {
  const features: Omit<Feature, "id" | "limits" | "isActive">[] = [
    {
      name: "Case Management",
      description: "Create, track, and manage cases.",
    },
    {
      name: "User Management",
      description: "Invite and manage users.",
    },
    {
      name: "Integrations",
      description: "Email / SMS / WhatsApp integrations.",
    },
    {
      name: "Custom Branding",
      description: "Brand the system with your firm’s identity.",
    },
  ];

  const result: Feature[] = [];
  for (const feature of features) {
    const created = await prisma_.feature.upsert({
      where: { name: feature.name },
      update: {},
      create: {
        ...feature,
        isActive: true,
      },
    });
    result.push(created);
  }

  console.log(`📝 Seeded ${result.length} plan features`);
  return result;
}

async function seedPlanFeatures(
  prisma_: PrismaClient,
  plans: Plan[],
  features: Feature[]
): Promise<void> {
  const associations: Array<{
    plan: string;
    featureNames: string[];
  }> = [
      {
        plan: "starter", // ✅ matches name in seedPlans
        featureNames: ["Case Management"],
      },
      {
        plan: "team",
        featureNames: ["Case Management", "User Management", "Integrations"],
      },
      {
        plan: "enterprise",
        featureNames: [
          "Case Management",
          "User Management",
          "Integrations",
          "Custom Branding",
        ],
      },
    ];

  for (const assoc of associations) {
    const plan = plans.find((p) => p.name === assoc.plan);
    if (!plan) {
      console.warn(`⚠️ Plan not found: ${assoc.plan}`);
      continue;
    }

    for (const featureName of assoc.featureNames) {
      const feature = features.find((f) => f.name === featureName);
      if (!feature) {
        console.warn(`⚠️ Feature not found: ${featureName}`);
        continue;
      }

      await prisma_.planFeature.upsert({
        where: {
          planId_featureId: {
            planId: plan.id,
            featureId: feature.id,
          },
        },
        update: {},
        create: {
          planId: plan.id,
          featureId: feature.id,
        },
      });
    }
  }

  console.log(`🧩 Plan-feature associations created successfully.`);
}

async function seedInstitutions(
  prisma_: PrismaClient,
  count = 2
): Promise<Institution[]> {
  const result: Institution[] = [];

  for (let i = 0; i < count; i++) {
    const name = `${faker.company.name()} Advocates`;
    const institution = await prisma_.institution.upsert({
      where: { name },
      update: {},
      create: {
        name,
        location: faker.location.city(),
        logoUrl: faker.image.avatar(),
        status: EntityStatus.ACTIVE,
      },
    });
    result.push(institution);
  }

  console.log(`📝 Seeded ${result.length} instittutions`);
  return result;
}

async function seedUsers(prisma_: PrismaClient, count = 3): Promise<User[]> {
  const result: User[] = [];

  for (let i = 0; i < count; i++) {
    const email = `antonio.oweki+${i + 1}@gmail.com`;
    const user = await prisma_.user.upsert({
      where: { email },
      update: {},
      create: {
        names: `Test${i + 1} ` + faker.person.lastName(),
        email,
        tel: faker.phone.number(),
        photoUrl: faker.image.avatar(),
        status: EntityStatus.ACTIVE,
        systemAdmin: i === 0,
      },
    });
    result.push(user);
  }

  console.log(`📝 Seeded ${result.length} users`);
  return result;
}

async function seedInstitutionUsers(
  prisma_: PrismaClient,
  users: User[],
  institutions: Institution[]
): Promise<void> {
  for (const user of users) {
    const institution =
      institutions[Math.floor(Math.random() * institutions.length)];

    await prisma_.institutionUser.upsert({
      where: {
        institutionId_userId: {
          institutionId: institution.id,
          userId: user.id,
        },
      },
      update: {},
      create: {
        institutionId: institution.id,
        userId: user.id,
        role: UserRole.LAWYER,
      },
    });
  }
}

async function seedSubscriptions(
  prisma_: PrismaClient,
  institutions: Institution[],
  plans: Plan[]
): Promise<void> {
  for (const institution of institutions) {
    const plan = plans[Math.floor(Math.random() * plans.length)];
    const startDate = faker.date.recent({ days: 10 });
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      startDate.getDate()
    );

    await prisma_.subscription.create({
      data: {
        institutionId: institution.id,
        planId: plan.id,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: startDate,
        currentPeriodEnd: endDate,
        cancelAtPeriodEnd: false,
      },
    });
  }
}

async function seedBlog(
  prisma_: PrismaClient,
  users: User[],
  count = 3
): Promise<void> {
  if (users.length === 0) return;

  const author = users[Math.floor(Math.random() * users.length)];

  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence();
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + faker.string.alphanumeric(6);

    await prisma_.blogpost.create({
      data: {
        title,
        slug,
        content: faker.lorem.paragraphs(2),
        authorId: author.id,
        status: faker.helpers.arrayElement(Object.values(ContentStatus)),
      },
    });
  }

  console.log(`📝 Seeded ${count} blog posts for ${author.email}`);
}

async function clearTables(prisma_: PrismaClient): Promise<void> {
  // Order matters due to foreign key constraints
  await prisma_.document.deleteMany({});
  await prisma_.reminder.deleteMany({});
  await prisma_.task.deleteMany({});
  await prisma_.case.deleteMany({});
  await prisma_.caseType.deleteMany({});
  await prisma_.subscription.deleteMany({});
  await prisma_.institutionUser.deleteMany({});
  await prisma_.user.deleteMany({});
  await prisma_.institution.deleteMany({});
  await prisma_.planFeature.deleteMany({});
  await prisma_.feature.deleteMany({});
  await prisma_.plan.deleteMany({});
}

// ---------------- RUN SCRIPT ----------------

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
