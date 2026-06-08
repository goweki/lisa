import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/blog";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { dateLong } from "@/lib/utils/dateHandlers";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  return {
    title: post?.title ?? "Blog Post",
    description: post?.excerpt ?? "",
    metadataBase: new URL("https://lisa.goweki.com"),
    openGraph: {
      images: [post?.coverImage ?? "/banner_onDark.png"],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return notFound();
  return (
    <div className="space-y-2 pt-6 md:space-y-5 mb-4">
      <Image
        src={post.coverImage || "/banner_onDark.png"}
        alt={`Cover for ${post.title}`}
        className="w-full max-h-[400px] object-cover rounded-xl mb-6"
        width="1302"
        height="715"
      />

      <h1>{post.title}</h1>

      <p className="text-muted-foreground mb-4 text-sm">
        {dateLong(new Date(post.createdAt))}
      </p>
      <article>
        {post.content.split("\n\n").map((para, i) => (
          <p key={i} className="py-2 md:py-4">
            {para}
          </p>
        ))}
      </article>
    </div>
  );
}
