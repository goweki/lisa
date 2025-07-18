"use client";
import Link from "next/link";
import React, { createContext, useState, useEffect } from "react";
import { Loader } from "@/components/atoms/loader";
import { Blog } from "@prisma/client";
import toast from "react-hot-toast";
export const BlogContext = createContext<Blog[]>([]);

export default function BlogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [blogposts, setBlog] = useState<Blog[] | null>(null);
  //onMount
  useEffect(() => {
    (async () => {
      const fetchOptions = {
        method: "GET",
      };
      const _blogposts: Blog[] | null = await fetch(
        `/api/data?collection=blog`,
        fetchOptions
      ).then(async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          const error_ =
            (await res_.json()) || "Unknown error, try again later";
          console.error("Error in sending reset password link:", error_);
          toast.error(error_.message || error_);
          return null;
        }
      });

      if (!_blogposts) return;

      setBlog(_blogposts);
    })();
  }, []);
  //render
  return !blogposts ? (
    <Loader />
  ) : typeof blogposts == "string" ? (
    <div className="text-center my-auto">
      <p className="text-center">
        There was an error loading the contents of this page. Check internet
        connectivity.
      </p>
      <p className="text-center">
        <Link
          href="/blogs"
          className="text-red-800 dark:text-red-400 underline"
        >
          click here
        </Link>{" "}
        to reload
      </p>
      {`\n > ERROR: ${blogposts}`}
    </div>
  ) : (
    <BlogContext.Provider value={blogposts}>{children}</BlogContext.Provider>
  );
}
