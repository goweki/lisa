import { seedPlans } from "./seeds/seedPlans";
import { seedFeatures } from "./seeds/seedFeatures";
import { seedInstitutions } from "./seeds/seedInstitutions";
import { seedUsers } from "./seeds/seedUsers";
import { seedInstitutionUsers } from "./seeds/seedInstitutionUsers";
import { seedSubscriptions } from "./seeds/seedSubscriptions";
import { seedCaseTypes } from "./seeds/seedCaseTypes";
import { seedCases } from "./seeds/seedCases";
import { seedTasks } from "./seeds/seedTasks";
import { seedReminders } from "./seeds/seedReminders";
import { seedDocuments } from "./seeds/seedDocuments";

import prisma from "../src/lib/prisma/prisma";
import { clearTables } from "./seeds/reset";

async function main() {
  if (process.env.NODE_ENV !== "production") {
    console.log("♻️ Clearing existing data...");
    await clearTables();
    console.log("✅ Tables cleared");
  }

  console.log("🌱 Starting database seeding...");

  await seedPlans();
  console.log("✅ Seeded plans");

  await seedFeatures();
  console.log("✅ Seeded features and plan-feature relations");

  await seedInstitutions();
  console.log("✅ Seeded institutions");

  await seedUsers();
  console.log("✅ Seeded users");

  await seedInstitutionUsers();
  console.log("✅ Linked users to institutions");

  await seedSubscriptions();
  console.log("✅ Seeded subscriptions");

  await seedCaseTypes();
  console.log("✅ Seeded case types");

  await seedCases();
  console.log("✅ Seeded cases");

  await seedTasks();
  console.log("✅ Seeded tasks");

  await seedReminders();
  console.log("✅ Seeded reminders");

  await seedDocuments();
  console.log("✅ Seeded documents");

  console.log("🌱 Database seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
