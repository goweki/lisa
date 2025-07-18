import prisma from "../../src/lib/prisma/prisma";

export async function seedInstitutions() {
  const institutions = [
    { name: "Justice League", location: "Nairobi" },
    { name: "Avengers Legal", location: "Mombasa" },
  ];

  for (const institution of institutions) {
    await prisma.institution.upsert({
      where: { name: institution.name },
      update: institution,
      create: institution,
    });
  }
}
