// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  console.log("SEEDING....");

  //institution - Lisa
  const institution = await prisma.institution.upsert({
    where: { name: "Lisa" },
    update: {
      email: "lisa@goweki.com",
      tel: "+254721334944",
      location: "Nairobi, Kenya",
    },
    create: {
      name: "Lisa",
      email: "lisa@goweki.com",
      tel: "+254721334944",
      location: "Nairobi, Kenya",
    },
  });

  //user - Lisa
  const user = await prisma.user.upsert({
    where: { email: "antonio@goweki.com" },
    update: {
      name: "Antonio",
      role: "admin",
      institutionIDs: [institution.id],
    },
    create: {
      email: "antonio@goweki.com",
      name: "Antonio",
      role: "admin",
      institutionIDs: [institution.id],
    },
  });

  //case types
  const caseTypes_ = [
    {
      name: "Divorce petition",
      primaryParty: "Petitioner",
      secondaryParty: "Respondent",
    },
    {
      name: "Personal injury lawsuit",
      primaryParty: "Claimant",
      secondaryParty: "Defendant",
    },
    // Add more case types as needed
  ];
  for (const caseType of caseTypes_) {
    await prisma.caseType.upsert({
      where: { name: caseType.name },
      update: {}, // No update operation if the record exists
      create: caseType, // Create operation if the record does not exist
    });
  }

  //add created user to institution
  // First, fetch the current userIDs for the institution
  const institutionExists = await prisma.institution.findUnique({
    where: { id: institution.id },
    select: { userIDs: true },
  });
  if (!institutionExists.userIDs.includes(user.id)) {
    // If user.id is not in the array, update the institution by pushing the new user.id
    await prisma.institution.update({
      where: { id: institution.id },
      data: {
        userIDs: {
          push: user.id,
        },
      },
    });
  }
  console.log("Institution(s) initialized:", await prisma.institution.count());
  console.log("User(s) initialized:", await prisma.user.count());
  console.log("caseTypes initialized:", await prisma.caseType.count());
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
