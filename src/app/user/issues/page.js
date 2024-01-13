"use client";
import { useContext, useState } from "react";
import { DataContext } from "../providers";
import CardIssue from "@/components/mols/cards";
import { SVGbriefcase, SVGpenscilSquare } from "@/components/atoms/svgs";

export default function IssuePage(params) {
  const issues = useContext(DataContext);
  const [searchPhrase, setSearchPhrase] = useState("");
  //render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-4 lg:px-6">
        <div className="space-y-2 pt-6 md:space-y-5">
          <h1 className="leading-9 sm:leading-10 tracking-tight md:leading-14 text-center">
            Issues
          </h1>
          <div className="relative max-w-lg m-auto">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchPhrase(e.target.value)}
                value={searchPhrase}
                placeholder="Search issues"
                className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 p-6 md:p-10">
          {issues.map((v) => (
            <div key={v._id}>
              <CardIssue
                item={v}
                icon={
                  v.type.type === "petition" ? SVGpenscilSquare : SVGbriefcase
                }
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
