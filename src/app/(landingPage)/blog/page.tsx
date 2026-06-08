"use client";
import { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { InputText } from "@/components/atoms/inputs";
import { strTruncate } from "@/lib/utils/stringHandlers";
import { BlogContext } from "./providers";
import { def_Input } from "@/types/custom";
import { Blogpost } from "@prisma/client";
import Link from "next/link";

export default function BlogPage() {
  const [searchPhrase, setSearchPhrase] = useState("");
  const [blogposts, setBlogposts] = useState<Blogpost[] | null>(null);
  const [slug, setSlug] = useState<Blogpost[] | null>(null);
  const blog = useContext(BlogContext);

  //filter blogposts by searchphrase
  useEffect(() => {
    const filtBlogposts = blog?.filter(({ title }) =>
      title.toLowerCase().includes(searchPhrase.toLowerCase()),
    );
    setBlogposts(filtBlogposts || []);
  }, [searchPhrase, blog]);

  //render
  return blogposts ? (
    <>
      <div className="space-y-2 pt-6 md:space-y-5 mb-4">
        <h1 className="text-center">BLOG</h1>
        <div className="relative max-w-lg m-auto">
          <InputText
            name="searchPhrase"
            valObj={{ value: searchPhrase, error: "" }}
            setValue={(valObj) => setSearchPhrase(valObj.value)}
            placeholder="Search for blog-posts by title"
          />
        </div>
      </div>
      {blogposts.length !== 0 ? (
        <ul className="grid grid-cols-1 xl:grid-cols-3 gap-y-10 gap-x-6 items-start p-8">
          {blog.map((v) => (
            <li
              key={v.id}
              className="relative flex flex-col sm:flex-row xl:flex-col items-start"
            >
              {renderCard(v)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center m-auto italic text-primary">
          Nothing to show
        </p>
      )}
    </>
  ) : (
    <main className="flex flex-col flex-grow items-center px-4">
      <p className="text-center m-auto italic text-primary">
        Still working on things here... Please check back in later
      </p>
    </main>
  );
}

function renderCard(post: Blogpost) {
  return (
    <>
      <div className="order-1 sm:ml-6 xl:ml-0">
        <h3 className="mb-1 text-slate-900 font-semibold dark:text-slate-200">
          <span className="mb-1 block text-xs italic leading-6 text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          {post.title}
        </h3>
        <div className="prose prose-slate prose-sm text-slate-600 dark:prose-dark">
          <p>{strTruncate(post.content, 100)}</p>
          <Link
            className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-backg-surface border border-primary text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500 mt-2"
            href={`/blog/${post.slug}`}
          >
            Read more
            <span className="sr-only">{post.title}</span>
            <svg
              className="overflow-visible ml-3 text-slate-300 group-hover:text-slate-400 dark:text-slate-500 dark:group-hover:text-slate-400"
              width="3"
              height="6"
              viewBox="0 0 3 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 0L3 3L0 6"></path>
            </svg>
          </Link>
        </div>
      </div>
      <Image
        src={post.coverImage || "/banner_onDark.png"}
        alt=""
        className="my-auto shadow-md rounded-lg bg-slate-50 w-full sm:w-[17rem] sm:mb-0 xl:mb-6 xl:w-full"
        width="1302"
        height="715"
      />
    </>
  );
}
