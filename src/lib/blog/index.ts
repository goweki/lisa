import prisma from "@/lib/prisma/prisma";

export async function getBlogPostBySlug(slug: string) {
  return await prisma.blogpost.findUnique({ where: { slug } });
}
