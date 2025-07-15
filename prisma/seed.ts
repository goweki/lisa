import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("🧹 Clearing database...");

  // Delete children first to avoid FK constraint errors
  await prisma.reminder.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.assigneeRequest.deleteMany();
  await prisma.case.deleteMany();
  await prisma.caseType.deleteMany();

  await prisma.paymentTransaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.planFeature.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.plan.deleteMany();

  await prisma.institutionUser.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  console.log("✅ Database cleared.");
}

async function main() {
  await clearDatabase();

  console.log("🌱 Seeding: Features...");
  const feature1 = await prisma.feature.create({
    data: {
      name: "Unlimited Cases",
      description: "Create unlimited cases for your institution",
    },
  });

  const feature2 = await prisma.feature.create({
    data: {
      name: "Advanced Reporting",
      description: "Access detailed analytics and reports",
    },
  });

  console.log("🌱 Seeding: Plan with features...");
  const plan = await prisma.plan.create({
    data: {
      name: "Pro Plan",
      description: "Best for growing law firms",
      price: 5000,
      priceMonthly: 5000,
      priceAnnual: 50000,
      currency: "KES",
      trialDays: 14,
      planFeatures: {
        create: [{ featureId: feature1.id }, { featureId: feature2.id }],
      },
    },
  });

  console.log("🌱 Seeding: Institution...");
  const institution = await prisma.institution.create({
    data: {
      name: "LexLaw LLP",
      location: "Nairobi",
      tel: "+254700000001",
      status: "ACTIVE",
    },
  });

  console.log("🌱 Seeding: Users...");
  const user1 = await prisma.user.create({
    data: {
      names: "User1 Lisa",
      email: "test1-lisa@goweki.com",
      systemAdmin: true,
      tel: "+254711111111",
      status: "ACTIVE",
      password: "hashed_password",
      institutions: {
        create: {
          institutionId: institution.id,
          role: "admin",
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      names: "User2 Lisa",
      email: "test2-lisa@goweki.com",
      tel: "+254722222222",
      password: "hashed_password",
      status: "ACTIVE",
      institutions: {
        create: {
          institutionId: institution.id,
          role: "admin",
        },
      },
    },
  });

  console.log("🌱 Seeding: Subscription...");
  const subscription = await prisma.subscription.create({
    data: {
      institutionId: institution.id,
      planId: plan.id,
      status: "ACTIVE",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ),
    },
  });

  console.log("🌱 Seeding: PaymentTransaction...");
  await prisma.paymentTransaction.create({
    data: {
      institutionId: institution.id,
      subscriptionId: subscription.id,
      paymentMethod: "MPESA",
      amount: 5000,
      providerTransactionId: "MPESA123ABC",
      status: "SUCCEEDED",
    },
  });

  console.log("🌱 Seeding: CaseType...");
  const caseType = await prisma.caseType.create({
    data: {
      name: "Civil Litigation",
      primaryParty: "Plaintiff",
      secondaryParty: "Defendant",
      institutionId: institution.id,
    },
  });

  console.log("🌱 Seeding: Case...");
  const courtCase = await prisma.case.create({
    data: {
      name: "Alice vs City Council",
      caseTypeID: caseType.id,
      institutionID: institution.id,
      userID: user2.id,
      clientParty: "Plaintiff",
      clientName: "Alice Mwangi",
      clientTel: "+254711111111",
      court: "High Court of Kenya",
    },
  });

  console.log("🌱 Seeding: Task...");
  const task = await prisma.task.create({
    data: {
      name: "File Response",
      type: "document",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      caseID: courtCase.id,
    },
  });

  console.log("🌱 Seeding: Document...");
  await prisma.document.create({
    data: {
      name: "Response Document",
      link: "https://example.com/docs/response.pdf",
      taskID: task.id,
    },
  });

  console.log("🌱 Seeding: Reminder...");
  await prisma.reminder.create({
    data: {
      regime: "days",
      count: 2,
      channel: "email",
      taskId: task.id,
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
