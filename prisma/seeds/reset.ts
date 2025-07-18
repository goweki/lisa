import prisma from "../../src/lib/prisma/prisma";

export async function clearTables() {
  // Order matters due to foreign key constraints
  await prisma.document.deleteMany({});
  await prisma.reminder.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.case.deleteMany({});
  await prisma.caseType.deleteMany({});
  await prisma.subscription.deleteMany({});
  await prisma.institutionUser.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.planFeature.deleteMany({});
  await prisma.feature.deleteMany({});
  await prisma.plan.deleteMany({});
}
