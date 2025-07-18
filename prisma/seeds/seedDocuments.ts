import prisma from "../../src/lib/prisma/prisma";

export async function seedDocuments() {
  const task = await prisma.task.findFirst({
    where: { name: "Prepare Witness List" },
  });

  if (task) {
    await prisma.document.create({
      data: {
        name: "Witness List PDF",
        link: "https://example.com/witness-list.pdf",
        taskID: task.id,
      },
    });
  }
}
