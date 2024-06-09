// import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// view seeded
async function retrieveSeed() {
  const institutions = await prisma.institution.findMany();

  for (const institution of institutions) {
    const users = await prisma.user.findMany({
      where: {
        institutionIDs: {
          has: institution.id,
        },
      },
    });

    console.log(`Institution: ${institution.name}`);
    users.forEach((user) => {
      console.log(`User: ${user.name}`);
    });
  }
}

retrieveSeed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
