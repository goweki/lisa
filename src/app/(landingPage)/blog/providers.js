"use client";
import Link from "next/link";
import { createContext, useState, useEffect } from "react";
import { Loader } from "@/components/atoms/loader";
import { httpCodes } from "@/lib/configs";
export const BlogContext = createContext();

export default function BlogProvider({ children }) {
  const [blogposts, setBlog] = useState(null);
  //onMount
  useEffect(() => {
    (() => {
      const fetchOptions = {
        method: "GET",
      };
      const blogpost_s = fetch(`/api/data?colle=library`, fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            const error_ =
              (await res_.json()) || "Unknown error, try again later";
            console.error("Error in sending reset password link:", error_);
            toast.error(error_.message || error_);
            return null;
          }
        }
      );

      if (!blogpost_s) return;

      setBlog(blogpost_s.filter((v_) => v_.type === "blogpost"));
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
