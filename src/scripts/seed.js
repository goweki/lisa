// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

async function seed() {
  console.log("SEEDING....");
  const institution = await prisma.institution.upsert({
    where: { name: "Lisa" },
    update: {
      email: "lisa@goweki.com",
      tel: "+254721334944",
      location: "Nairobi,Kenya",
    },
    create: {
      name: "Lisa",
      email: "lisa@goweki.com",
      tel: "+254721334944",
      location: "Nairobi,Kenya",
    },
  });
  const user = await prisma.user.upsert({
    where: { email: "antonio@goweki.com" },
    update: {
      name: "Antonio",
      email: "antonio@goweki.com",
      password: "$2a$10$8aYZYMNUMZsm77MbkGmyROKDIGu5DczxAAT8UDDx8LFhPe4RPHHD6",
      role: "admin",
      institutionIDs: [institution.id],
    },
    create: {
      email: "antonio@goweki.com",
      name: "Antonio",
      password: "$2a$10$8aYZYMNUMZsm77MbkGmyROKDIGu5DczxAAT8UDDx8LFhPe4RPHHD6",
      role: "admin",
      institutionIDs: [institution.id],
    },
  });
  // const caseTypes = await prisma.caseType.createMany({
  //   data: caseTypes_,
  // });
  for (const caseType of caseTypes_) {
    await prisma.caseType.upsert({
      where: { name: caseType.name },
      update: {}, // No update operation if the record exists
      create: caseType, // Create operation if the record does not exist
    });
  }
  //add created user to institution
  // First, fetch the current userIDs for the institution
  const userExists = await prisma.institution.findUnique({
    where: { id: institution.id },
    select: { userIDs: true },
  });
  if (!institution.userIDs.includes(user.id)) {
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
  console.log("Institution initialized:", await prisma.institution.findMany());
  console.log("User initialized:", await prisma.user.findMany());
  console.log("caseTypes initialized:", await prisma.caseType.findMany());
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
