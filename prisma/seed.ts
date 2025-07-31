import {
  PrismaClient,
  Plan,
  Feature,
  User,
  Institution,
  UserRole,
  SubscriptionStatus,
  EntityStatus,
  CaseType,
  Blogpost,
  PlanName,
} from "@prisma/client";
import {
  planFeatureAssociations as planFeatures,
  blogPosts,
  plans,
  features,
  defaultCaseTypes,
  systemUser,
} from "./seed-data";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("🌱 Starting database seeding...");
  await seedCaseTypes(prisma);
  const plans = await seedPlans(prisma);
  const features = await seedFeatures(prisma);
  await seedPlanFeatures(prisma, plans, features);

  const institutions = await seedInstitutions(prisma);
  const users = await seedUsers(prisma);

  await seedInstitutionUsers(prisma, users.withInstitution, institutions);
  await seedSubscriptions(prisma, institutions, plans);

  if (users.system) {
    await seedBlog(prisma, users.system);
  } else {
    console.log("⚠️  No user with (isSystem===true), skipping seeding blogs");
  }

  console.log("✅ Seeding complete.");
}

// ---------------- SEED FUNCTIONS ----------------

async function seedCaseTypes(prisma: PrismaClient): Promise<CaseType[]> {
  console.log(` > Seeding case types (VERBOSE=true)`);
  const seededCaseTypes: CaseType[] = [];

  for (const caseType of defaultCaseTypes) {
    const existing = await prisma.caseType.findUnique({
      where: { name: caseType.name },
    });

    if (!existing) {
      const created = await prisma.caseType.create({ data: caseType });
      console.log(` >> ${caseType.name}`);
      seededCaseTypes.push(created);
    } else {
      console.warn(` >> Already Exists: - ${caseType.name}`);
    }
  }

  console.log(
    `${seededCaseTypes.length !== 0 ? "📝 " : "⚠️ "} Inserted ${seededCaseTypes.length} casetypes`
  );
  return seededCaseTypes;
}

async function seedPlans(prisma_: PrismaClient): Promise<Plan[]> {
  const result = await Promise.all(
    plans.map((plan) =>
      prisma_.plan.upsert({
        where: { name: plan.name },
        update: {},
        create: { ...plan, isActive: true },
      })
    )
  );
  console.log(`📝 Seeded plans`);
  return result;
}

async function seedFeatures(prisma_: PrismaClient): Promise<Feature[]> {
  const result = await Promise.all(
    features.map((feature) =>
      prisma_.feature.upsert({
        where: { name: feature.name },
        update: {},
        create: { ...feature },
      })
    )
  );
  console.log(`📝 Seeded plan features`);
  return result;
}

async function seedPlanFeatures(
  prisma_: PrismaClient,
  plans: Plan[],
  features: Feature[]
): Promise<void> {
  const featureMap = new Map(features.map((f) => [f.name, f]));
  const planMap = new Map(plans.map((p) => [p.name, p]));

  for (const assoc of planFeatures) {
    const plan = planMap.get(assoc.plan as PlanName);
    if (!plan) continue;

    await Promise.all(
      assoc.featureNames.map(async (featureName) => {
        const feature = featureMap.get(featureName);
        if (!feature) return;

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
      })
    );
  }

  console.log(`🧩 Plan-feature associations seeded.`);
}

async function seedInstitutions(
  prisma_: PrismaClient,
  count = 1
): Promise<Institution[]> {
  const result: Institution[] = [];

  for (let i = 0; i < count; i++) {
    const name = `Lisa Advocates ${i + 1}`;
    const institution = await prisma_.institution.upsert({
      where: { name },
      update: {},
      create: {
        name,
        location: faker.location.city(),
        logoUrl: faker.image.avatar(),
      },
    });
    result.push(institution);
  }

  console.log(`📝 Seeded institutions`);
  return result;
}

async function seedUsers(
  prisma_: PrismaClient,
  count = 2
): Promise<{ system: User | null; withInstitution: User[] }> {
  const result: { system: User | null; withInstitution: User[] } = {
    system: null,
    withInstitution: [],
  };

  // const systemUser_ = await prisma_.user.create({ data: systemUser });
  const systemUser_ = await prisma_.user.upsert({
    where: { email: systemUser.email },
    update: {},
    create: systemUser,
  });
  result.system = systemUser_;

  const users = await Promise.all(
    Array.from({ length: count }).map((_, i) => {
      const email = `antonio.oweki+${i + 1}@gmail.com`;
      return prisma_.user.upsert({
        where: { email },
        update: {},
        create: {
          names: `User${i + 1} Lisa`,
          email,
          tel: faker.phone.number(),
          photoUrl: faker.image.avatar(),
          status: EntityStatus.ACTIVE,
          systemAdmin: false,
        },
      });
    })
  );

  result.withInstitution = users;
  const totalUsers = (result.system ? 1 : 0) + result.withInstitution.length;
  console.log(`📝 Seeded users`);
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
  console.log("🧩 Users Intitutions linkage seeded");
}

async function seedSubscriptions(
  prisma_: PrismaClient,
  institutions: Institution[],
  plans: Plan[]
): Promise<void> {
  for (const institution of institutions) {
    const existing = await prisma_.subscription.findFirst({
      where: {
        institutionId: institution.id,
        status: SubscriptionStatus.ACTIVE,
      },
    });
    if (existing) continue;

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
  systemUser: User
): Promise<void> {
  console.log(` > Seeding blogposts (VERBOSE=true)`);
  const seededBlogPosts: Blogpost[] = [];

  for (const blogpost of blogPosts) {
    const existing = await prisma.blogpost.findUnique({
      where: { slug: blogpost.slug },
    });

    if (!existing) {
      const created = await prisma.blogpost.create({
        data: { ...blogpost, authorId: systemUser.id },
      });
      console.log(` >> Seeded blogpost: ${created.slug}`);
      seededBlogPosts.push(created);
    } else {
      console.log(` >> Already Exists: ${blogpost.slug}`);
    }
  }

  console.log(
    `${seededBlogPosts.length !== 0 ? "📝 " : "⚠️ "} Inserted ${seededBlogPosts.length} blog posts for ${systemUser.email}`
  );
}

// ---------------- RUN SCRIPT ----------------

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
