import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data (optional - remove if you want to preserve data)
  await prisma.paymentTransaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.planFeature.deleteMany();
  await prisma.feature.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.document.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.task.deleteMany();
  await prisma.assigneeRequest.deleteMany();
  await prisma.case.deleteMany();
  await prisma.caseType.deleteMany();
  await prisma.institutionUser.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  // Create Features
  console.log("📋 Creating features...");
  const features = await Promise.all([
    prisma.feature.create({
      data: {
        name: "Case Management",
        description: "Manage legal cases and track progress",
        limits: { maxCases: 100 },
        isActive: true,
      },
    }),
    prisma.feature.create({
      data: {
        name: "Document Storage",
        description: "Store and organize legal documents",
        limits: { maxStorage: "10GB" },
        isActive: true,
      },
    }),
    prisma.feature.create({
      data: {
        name: "Task Management",
        description: "Create and track tasks for cases",
        limits: { maxTasks: 500 },
        isActive: true,
      },
    }),
    prisma.feature.create({
      data: {
        name: "User Management",
        description: "Manage users and permissions",
        limits: { maxUsers: 25 },
        isActive: true,
      },
    }),
    prisma.feature.create({
      data: {
        name: "Reminder System",
        description: "Set up reminders for important dates",
        limits: { maxReminders: 200 },
        isActive: true,
      },
    }),
  ]);

  // Create Plans
  console.log("💰 Creating pricing plans...");
  const basicPlan = await prisma.plan.create({
    data: {
      name: "Basic",
      description: "Perfect for small law firms",
      price: 5000,
      currency: "KES",
      priceMonthly: 5000,
      priceAnnual: 50000,
      trialDays: 14,
      isActive: true,
    },
  });

  const professionalPlan = await prisma.plan.create({
    data: {
      name: "Professional",
      description: "Ideal for growing law firms",
      price: 15000,
      currency: "KES",
      priceMonthly: 15000,
      priceAnnual: 150000,
      trialDays: 14,
      isActive: true,
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: "Enterprise",
      description: "For large law firms and institutions",
      price: 35000,
      currency: "KES",
      priceMonthly: 35000,
      priceAnnual: 350000,
      trialDays: 30,
      isActive: true,
    },
  });

  // Create Plan Features
  console.log("🔗 Linking features to plans...");
  await Promise.all([
    // Basic Plan Features
    prisma.planFeature.create({
      data: {
        planId: basicPlan.id,
        featureId: features[0].id, // Case Management
        limits: { maxCases: 50 },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: basicPlan.id,
        featureId: features[1].id, // Document Storage
        limits: { maxStorage: "5GB" },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: basicPlan.id,
        featureId: features[2].id, // Task Management
        limits: { maxTasks: 200 },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: basicPlan.id,
        featureId: features[3].id, // User Management
        limits: { maxUsers: 5 },
      },
    }),

    // Professional Plan Features
    prisma.planFeature.create({
      data: {
        planId: professionalPlan.id,
        featureId: features[0].id, // Case Management
        limits: { maxCases: 200 },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: professionalPlan.id,
        featureId: features[1].id, // Document Storage
        limits: { maxStorage: "25GB" },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: professionalPlan.id,
        featureId: features[2].id, // Task Management
        limits: { maxTasks: 1000 },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: professionalPlan.id,
        featureId: features[3].id, // User Management
        limits: { maxUsers: 15 },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: professionalPlan.id,
        featureId: features[4].id, // Reminder System
        limits: { maxReminders: 500 },
      },
    }),

    // Enterprise Plan Features
    prisma.planFeature.create({
      data: {
        planId: enterprisePlan.id,
        featureId: features[0].id, // Case Management
        limits: { maxCases: -1 }, // Unlimited
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: enterprisePlan.id,
        featureId: features[1].id, // Document Storage
        limits: { maxStorage: "100GB" },
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: enterprisePlan.id,
        featureId: features[2].id, // Task Management
        limits: { maxTasks: -1 }, // Unlimited
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: enterprisePlan.id,
        featureId: features[3].id, // User Management
        limits: { maxUsers: -1 }, // Unlimited
      },
    }),
    prisma.planFeature.create({
      data: {
        planId: enterprisePlan.id,
        featureId: features[4].id, // Reminder System
        limits: { maxReminders: -1 }, // Unlimited
      },
    }),
  ]);

  // Create Institutions
  console.log("🏢 Creating institutions...");
  const institutions = await Promise.all([
    prisma.institution.create({
      data: {
        name: "Nairobi Legal Associates",
        location: "Nairobi, Kenya",
        tel: "+254700123456",
        logoUrl: "https://example.com/logo1.png",
        status: "ACTIVE",
      },
    }),
    prisma.institution.create({
      data: {
        name: "Mombasa Law Firm",
        location: "Mombasa, Kenya",
        tel: "+254701234567",
        logoUrl: "https://example.com/logo2.png",
        status: "ACTIVE",
      },
    }),
    prisma.institution.create({
      data: {
        name: "Kisumu Legal Services",
        location: "Kisumu, Kenya",
        tel: "+254702345678",
        logoUrl: "https://example.com/logo3.png",
        status: "DORMANT",
      },
    }),
  ]);

  // Create Users
  console.log("👥 Creating users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        names: "John Doe",
        email: "john.doe@nairobilegal.co.ke",
        tel: "+254700111222",
        password: hashedPassword,
        role: "admin",
        photoUrl: "https://example.com/photo1.jpg",
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        names: "Jane Smith",
        email: "jane.smith@nairobilegal.co.ke",
        tel: "+254700222333",
        password: hashedPassword,
        role: "lawyer",
        photoUrl: "https://example.com/photo2.jpg",
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        names: "Michael Johnson",
        email: "michael.johnson@mombasalaw.co.ke",
        tel: "+254700333444",
        password: hashedPassword,
        role: "advocate",
        photoUrl: "https://example.com/photo3.jpg",
        status: "ACTIVE",
      },
    }),
    prisma.user.create({
      data: {
        names: "Sarah Wilson",
        email: "sarah.wilson@kisumulegal.co.ke",
        tel: "+254700444555",
        password: hashedPassword,
        role: "lawyer",
        photoUrl: "https://example.com/photo4.jpg",
        status: "DORMANT",
      },
    }),
    prisma.user.create({
      data: {
        names: "System Admin",
        email: "admin@system.com",
        tel: "+254700999999",
        password: hashedPassword,
        role: "system_admin",
        status: "ACTIVE",
      },
    }),
  ]);

  // Create Institution-User relationships
  console.log("🔗 Creating institution-user relationships...");
  await Promise.all([
    prisma.institutionUser.create({
      data: {
        institutionId: institutions[0].id,
        userId: users[0].id,
        role: users[0].role,
      },
    }),
    prisma.institutionUser.create({
      data: {
        institutionId: institutions[0].id,
        userId: users[1].id,
        role: users[0].role,
      },
    }),
    prisma.institutionUser.create({
      data: {
        institutionId: institutions[1].id,
        userId: users[2].id,
        role: users[0].role,
      },
    }),
    prisma.institutionUser.create({
      data: {
        institutionId: institutions[2].id,
        userId: users[3].id,
        role: users[0].role,
      },
    }),
  ]);

  // Create Subscriptions
  console.log("📅 Creating subscriptions...");
  const subscriptions = await Promise.all([
    prisma.subscription.create({
      data: {
        institutionId: institutions[0].id,
        planId: professionalPlan.id,
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        cancelAtPeriodEnd: false,
      },
    }),
    prisma.subscription.create({
      data: {
        institutionId: institutions[1].id,
        planId: basicPlan.id,
        status: "TRIALING",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        cancelAtPeriodEnd: false,
      },
    }),
  ]);

  // Create Case Types
  console.log("⚖️ Creating case types...");
  const caseTypes = await Promise.all([
    prisma.caseType.create({
      data: {
        institutionId: institutions[0].id,
        name: "Civil Litigation",
        primaryParty: "Plaintiff",
        secondaryParty: "Defendant",
      },
    }),
    prisma.caseType.create({
      data: {
        institutionId: institutions[0].id,
        name: "Criminal Defense",
        primaryParty: "State",
        secondaryParty: "Accused",
      },
    }),
    prisma.caseType.create({
      data: {
        institutionId: institutions[1].id,
        name: "Corporate Law",
        primaryParty: "Company",
        secondaryParty: "Opposing Party",
      },
    }),
    prisma.caseType.create({
      data: {
        name: "Family Law",
        primaryParty: "Petitioner",
        secondaryParty: "Respondent",
      },
    }),
  ]);

  // Create Cases
  console.log("📋 Creating cases...");
  const cases = await Promise.all([
    prisma.case.create({
      data: {
        name: "Smith vs. Johnson Property Dispute",
        description: "Boundary dispute between neighboring properties",
        status: "open",
        caseNumber: "NLA-2025-001",
        clientParty: "Plaintiff",
        clientName: "Robert Smith",
        clientTel: "+254700555666",
        clientEmail: "robert.smith@email.com",
        clientID: "12345678",
        otherPartyName: "Mary Johnson",
        otherPartyTel: "+254700666777",
        otherPartyEmail: "mary.johnson@email.com",
        otherPartyDescription: "Neighboring property owner",
        court: "Nairobi High Court",
        caseTypeID: caseTypes[0].id,
        institutionID: institutions[0].id,
        userID: users[1].id,
        createdBy: users[0].id,
      },
    }),
    prisma.case.create({
      data: {
        name: "State vs. Peter Kamau",
        description: "Theft charges against the accused",
        status: "open",
        caseNumber: "NLA-2025-002",
        clientParty: "Accused",
        clientName: "Peter Kamau",
        clientTel: "+254700777888",
        clientEmail: "peter.kamau@email.com",
        clientID: "87654321",
        otherPartyName: "State of Kenya",
        otherPartyDescription: "Prosecution",
        court: "Nairobi Magistrates Court",
        caseTypeID: caseTypes[1].id,
        institutionID: institutions[0].id,
        userID: users[1].id,
        createdBy: users[0].id,
      },
    }),
    prisma.case.create({
      data: {
        name: "ABC Corp Merger",
        description: "Legal assistance for corporate merger",
        status: "open",
        caseNumber: "MLF-2025-001",
        clientParty: "Company",
        clientName: "ABC Corporation",
        clientTel: "+254700888999",
        clientEmail: "legal@abccorp.co.ke",
        otherPartyName: "XYZ Ltd",
        otherPartyDescription: "Merger partner",
        caseTypeID: caseTypes[2].id,
        institutionID: institutions[1].id,
        userID: users[2].id,
        createdBy: users[2].id,
      },
    }),
  ]);

  // Create Tasks
  console.log("✅ Creating tasks...");
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        name: "File court documents",
        type: "document",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        description:
          "Submit initial court filings for the property dispute case",
        caseID: cases[0].id,
      },
    }),
    prisma.task.create({
      data: {
        name: "Client consultation",
        type: "event",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        description: "Meet with client to discuss case strategy",
        caseID: cases[0].id,
      },
    }),
    prisma.task.create({
      data: {
        name: "Evidence collection",
        type: "document",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        description: "Gather evidence for the theft case",
        caseID: cases[1].id,
      },
    }),
    prisma.task.create({
      data: {
        name: "Draft merger agreement",
        type: "document",
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        description: "Prepare the merger agreement documents",
        caseID: cases[2].id,
        completedByID: users[2].id,
      },
    }),
  ]);

  // Create Documents
  console.log("📄 Creating documents...");
  await Promise.all([
    prisma.document.create({
      data: {
        name: "Property Survey Report",
        link: "https://example.com/documents/survey-report.pdf",
        taskID: tasks[0].id,
      },
    }),
    prisma.document.create({
      data: {
        name: "Client Statement",
        link: "https://example.com/documents/client-statement.pdf",
        taskID: tasks[0].id,
      },
    }),
    prisma.document.create({
      data: {
        name: "Police Report",
        link: "https://example.com/documents/police-report.pdf",
        taskID: tasks[2].id,
      },
    }),
    prisma.document.create({
      data: {
        name: "Merger Draft v1",
        link: "https://example.com/documents/merger-draft.pdf",
        taskID: tasks[3].id,
      },
    }),
  ]);

  // Create Reminders
  console.log("⏰ Creating reminders...");
  await Promise.all([
    prisma.reminder.create({
      data: {
        regime: "days",
        count: 1,
        channel: "email",
        taskId: tasks[0].id,
      },
    }),
    prisma.reminder.create({
      data: {
        regime: "hours",
        count: 2,
        channel: "sms",
        taskId: tasks[1].id,
      },
    }),
    prisma.reminder.create({
      data: {
        regime: "days",
        count: 3,
        channel: "whatsapp",
        taskId: tasks[2].id,
      },
    }),
  ]);

  // Create Assignee Requests
  console.log("👨‍⚖️ Creating assignee requests...");
  await Promise.all([
    prisma.assigneeRequest.create({
      data: {
        caseID: cases[0].id,
        assigneeID: users[1].id,
        status: "approved",
      },
    }),
    prisma.assigneeRequest.create({
      data: {
        caseID: cases[1].id,
        assigneeID: users[1].id,
        status: "pending",
      },
    }),
    prisma.assigneeRequest.create({
      data: {
        caseID: cases[2].id,
        assigneeID: users[2].id,
        status: "approved",
      },
    }),
  ]);

  // Create Payment Transactions
  console.log("💳 Creating payment transactions...");
  await Promise.all([
    prisma.paymentTransaction.create({
      data: {
        institutionId: institutions[0].id,
        subscriptionId: subscriptions[0].id,
        paymentMethod: "M-Pesa",
        amount: 15000,
        currency: "KES",
        status: "SUCCEEDED",
        providerTransactionId: "MPESA123456789",
        description: "Monthly subscription payment",
        metadata: JSON.stringify({ phone: "+254700123456" }),
      },
    }),
    prisma.paymentTransaction.create({
      data: {
        institutionId: institutions[1].id,
        subscriptionId: subscriptions[1].id,
        paymentMethod: "Bank Transfer",
        amount: 5000,
        currency: "KES",
        status: "PENDING",
        providerTransactionId: "BANK987654321",
        description: "Trial period payment",
        metadata: JSON.stringify({ accountNumber: "1234567890" }),
      },
    }),
    prisma.paymentTransaction.create({
      data: {
        institutionId: institutions[0].id,
        paymentMethod: "Credit Card",
        amount: 2000,
        currency: "KES",
        status: "FAILED",
        providerTransactionId: "CARD456789123",
        description: "Failed payment attempt",
        metadata: JSON.stringify({ cardLast4: "1234" }),
      },
    }),
  ]);

  console.log("✅ Database seeding completed successfully!");

  // Print summary
  console.log("\n📊 Seeding Summary:");
  console.log(`- Created ${await prisma.feature.count()} features`);
  console.log(`- Created ${await prisma.plan.count()} plans`);
  console.log(`- Created ${await prisma.institution.count()} institutions`);
  console.log(`- Created ${await prisma.user.count()} users`);
  console.log(`- Created ${await prisma.caseType.count()} case types`);
  console.log(`- Created ${await prisma.case.count()} cases`);
  console.log(`- Created ${await prisma.task.count()} tasks`);
  console.log(`- Created ${await prisma.document.count()} documents`);
  console.log(`- Created ${await prisma.reminder.count()} reminders`);
  console.log(`- Created ${await prisma.subscription.count()} subscriptions`);
  console.log(
    `- Created ${await prisma.paymentTransaction.count()} payment transactions`
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
