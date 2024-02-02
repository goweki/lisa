"use client";
import Link from "next/link";
import { createContext, useState, useEffect } from "react";
import { Loader1 } from "@/components/atoms/loader";
import { httpCodes } from "@/lib/configs";
export const BlogContext = createContext();

export default function BlogProvider({ children }) {
  const [blogposts, setBlog] = useState(null);
  //onMount
  useEffect(() => {
    const fetchOptions = {
      method: "GET",
    };
    fetch(`/api/data?colle=library`, fetchOptions)
      .then((res_) => {
        if (res_.ok) {
          return res_.json();
        } else {
          setBlog(httpCodes[res_.status]);
          return false;
        }
      })
      .then((json_) => {
        if (json_?.success) {
          setBlog(json_.success.filter((v) => v.type === "blogpost"));
        } else {
          console.error(
            "FAILED: could not fetch library items\n > " +
              JSON.stringify(json_.error ?? "....") +
              "\n................"
          );
          setBlog("failed");
        }
      })
      .catch((err) => {
        setBlog("failed");
        console.error("ERROR: caught error\n > " + err);
      });
  }, []);
  //render
  return !blogposts ? (
    <Loader1 />
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
