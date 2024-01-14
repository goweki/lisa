"use client";
import { useState } from "react";
import { InputText } from "@/components/atoms/inputs";

export default function IssuePage({ slug }) {
  const [searchPhrase, setSearchPhrase] = useState("");
  //render
  return (
    <main className="flex flex-col flex-grow items-center px-4">
      <div className="max-w-screen-lg mx-auto px-4 md:px-6">
        <div className="space-y-2 pt-6 md:space-y-5 mb-4">
          <h1 className="text-center">BLOG</h1>
          <div className="relative max-w-lg m-auto">
            <InputText
              name="searchPhrase"
              value={searchPhrase}
              setValue={setSearchPhrase}
              placeholder="Search for blog-posts"
            />
          </div>
        </div>
        <ul className="grid grid-cols-1 xl:grid-cols-3 gap-y-10 gap-x-6 items-start p-8">
          <li className="relative flex flex-col sm:flex-row xl:flex-col items-start">
            <div className="order-1 sm:ml-6 xl:ml-0">
              <h3 className="mb-1 text-slate-900 font-semibold dark:text-slate-200">
                <span className="mb-1 block text-sm leading-6 text-indigo-500">
                  Headless UI
                </span>
                Completely unstyled, fully accessible UI components
              </h3>
              <div className="prose prose-slate prose-sm text-slate-600 dark:prose-dark">
                <p>
                  Completely unstyled, fully accessible UI components, designed
                  to integrate beautifully with Tailwind CSS.
                </p>
              </div>
              <a
                className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-6"
                href="https://headlessui.dev"
              >
                Learn more
                <span className="sr-only">
                  , Completely unstyled, fully accessible UI components
                </span>
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
            <img
              src="https://tailwindcss.com/_next/static/media/headlessui@75.c1d50bc1.jpg"
              alt=""
              className="mb-6 shadow-md rounded-lg bg-slate-50 w-full sm:w-[17rem] sm:mb-0 xl:mb-6 xl:w-full"
              width="1216"
              height="640"
            />
          </li>
          <li className="relative flex flex-col sm:flex-row xl:flex-col items-start">
            <div className="order-1 sm:ml-6 xl:ml-0">
              <h3 className="mb-1 text-slate-900 font-semibold dark:text-slate-200">
                <span className="mb-1 block text-sm leading-6 text-purple-500">
                  Heroicons
                </span>
                Beautiful hand-crafted SVG icons, by the makers of Tailwind CSS.
              </h3>
              <div className="prose prose-slate prose-sm text-slate-600 dark:prose-dark">
                <p>
                  A set of 450+ free MIT-licensed SVG icons. Available as basic
                  SVG icons and via first-party React and Vue libraries.
                </p>
              </div>
              <a
                className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-6"
                href="https://heroicons.com"
              >
                Learn more
                <span className="sr-only">
                  , Beautiful hand-crafted SVG icons, by the makers of Tailwind
                  CSS.
                </span>
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
            <img
              src="https://tailwindcss.com/_next/static/media/heroicons@75.4a558f35.jpg"
              alt=""
              className="mb-6 shadow-md rounded-lg bg-slate-50 w-full sm:w-[17rem] sm:mb-0 xl:mb-6 xl:w-full"
              width="1216"
              height="640"
            />
          </li>
          <li className="relative flex flex-col sm:flex-row xl:flex-col items-start">
            <div className="order-1 sm:ml-6 xl:ml-0">
              <h3 className="mb-1 text-slate-900 font-semibold dark:text-slate-200">
                <span className="mb-1 block text-sm leading-6 text-cyan-500">
                  Hero Patterns
                </span>
                Seamless SVG background patterns by the makers of Tailwind CSS.
              </h3>
              <div className="prose prose-slate prose-sm text-slate-600 dark:prose-dark">
                <p>
                  A collection of over 100 free MIT-licensed high-quality SVG
                  patterns for you to use in your web projects.
                </p>
              </div>
              <a
                className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500 mt-6"
                href="https://heropatterns.com"
              >
                Learn more
                <span className="sr-only">
                  , Seamless SVG background patterns by the makers of Tailwind
                  CSS.
                </span>
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
            <img
              src="https://tailwindcss.com/_next/static/media/heropatterns@75.82a09697.jpg"
              alt=""
              className="mb-6 shadow-md rounded-lg bg-slate-50 w-full sm:w-[17rem] sm:mb-0 xl:mb-6 xl:w-full"
              width="1216"
              height="640"
            />
          </li>
        </ul>
      </div>
    </main>
  );
}
