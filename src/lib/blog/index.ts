import prisma from "@/lib/prisma";

export async function getBlogPostBySlug(slug: string) {
  return await prisma.blogpost.findUnique({ where: { slug } });
}
