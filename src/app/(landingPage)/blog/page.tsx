"use client";
import { useState, useContext } from "react";
import Image from "next/image";
import { InputText } from "@/components/atoms/inputs";
import { strTruncate } from "@/helpers/stringHandlers";
import { BlogContext } from "./providers";
import { def_Input } from "@/types/custom";
import { Blogpost } from "@prisma/client";

export default function BlogPage({
  params,
  searchParams,
}: {
  params: { post: string };
  searchParams: { [key: string]: string };
}) {
  const [searchPhrase, setSearchPhrase] = useState(def_Input);
  const blogposts = useContext(BlogContext);
  //render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg mx-auto px-4 md:px-6">
        <div className="space-y-2 pt-6 md:space-y-5 mb-4">
          <h1 className="text-center">BLOG</h1>
          <div className="relative max-w-lg m-auto">
            <InputText
              name="searchPhrase"
              valObj={searchPhrase}
              setValue={setSearchPhrase}
              placeholder="Search for blog-posts"
            />
          </div>
        </div>
        <ul className="grid grid-cols-1 xl:grid-cols-3 gap-y-10 gap-x-6 items-start p-8">
          {blogposts.length !== 0 ? (
            blogposts.map((v) => (
              <li
                key={v.id}
                className="relative flex flex-col sm:flex-row xl:flex-col items-start"
              >
                {renderCard(v)}
              </li>
            ))
          ) : (
            <>Still working on things here... Please check back in later </>
          )}
        </ul>
      </div>
    </main>
  );
}

function renderCard(post: Blogpost) {
  return (
    <>
      <div className="order-1 sm:ml-6 xl:ml-0">
        <h3 className="mb-1 text-slate-900 font-semibold dark:text-slate-200">
          <span className="mb-1 block text-sm leading-6 text-muted-foreground">
            {new Date(post.createdAt).toDateString()}
          </span>
          {post.title}
        </h3>
        <div className="prose prose-slate prose-sm text-slate-600 dark:prose-dark">
          <p>{strTruncate(post.content, 100)}</p>
        </div>
        <a
          className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-backg-surface text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus:ring-slate-500 mt-2"
          href="#"
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
        </a>
      </div>
      <Image
        src={post.coverImage || "/banner_onDark.png"}
        alt=""
        className="mb-6 shadow-md rounded-lg bg-slate-50 w-full sm:w-[17rem] sm:mb-0 xl:mb-6 xl:w-full"
        width="1302"
        height="715"
      />
    </>
  );
}
