"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { DataContext } from "../../providers";
import CardIssue from "@/components/mols/cards";
import { SVGbriefcase, SVGpenscilSquare } from "@/components/atoms/svgs";

export default function IssueForm({ params }) {
  const { slug } = params;
  const issues = useContext(DataContext);
  const [selected, setSelected] = useState("");
  // check slug and update selected
  useEffect(() => {
    if (slug[0] !== "new")
      setSelected(issues.find(({ _id }) => _id === slug[0]));
  }, [issues, slug]);
  //render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6">
        {slug[0] === "new" ? (
          <>New slug: Create new issue</>
        ) : selected ? (
          <>
            <div className="space-y-2 pt-6 md:space-y-5">
              <h1 className="leading-9 sm:leading-10 tracking-tight md:leading-14 text-center">
                {selected.name}
              </h1>
              <h2>
                {selected.type.type} {selected.type.category}
              </h2>
            </div>
            {/* <div className="grid gap-8 md:grid-cols-2 lg:gap-12 p-6 md:p-10">
              {issues.map((v) => (
                <div key={v._id}>
                  <CardIssue
                    item={v}
                    icon={
                      v.type.type === "petition"
                        ? SVGpenscilSquare
                        : SVGbriefcase
                    }
                  />
                </div>
              ))}
            </div> */}
          </>
        ) : (
          <div className="my-12">
            Issue was not found.{" "}
            <Link href="/user/issues" className="text-emerald-400">
              Click here{" "}
            </Link>{" "}
            to view all isuues
          </div>
        )}
      </div>
    </main>
  );
}
