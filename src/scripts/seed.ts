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
  const caseTypes = await prisma.caseType.createMany({
    data: caseTypes_,
  });
  const updatedInstitution = await prisma.institution.update({
    where: { id: institution.id },
    data: {
      userIDs: {
        push: user.id,
      },
    },
  });
  console.log("Institution initialized:", updatedInstitution);
  console.log("User initialized:", user);
  console.log("caseTypes initialized:", caseTypes);
}

async function retrieveSeed() {
  const populatedInstitutions = await prisma.institution.findMany({
    include: {
      users: true,
    },
  });

  console.log("Institutions:", populatedInstitutions);
  console.log("Users:", populatedInstitutions[0].users);
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

// retrieveSeed()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
