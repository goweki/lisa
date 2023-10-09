"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SVGlogo } from "./atoms/svgs";
import { ButtonPrimary } from "./atoms/buttons";
import ThemeToggler from "./atoms/themeToggle";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav
      className={`sticky bg-background-surface dark:bg-background-dark-surface w-full z-20 top-0 left-0 border-b border-emerald-800`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex flex-row items-center">
          <Link href="/" className="flex items-center">
            <SVGlogo className="h-8 mr-3" />
            {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              lisa
            </span> */}
          </Link>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto"
            id="navbar-sticky"
          >
            {/* {pathname.includes("/home") && (
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <Link
                  href="#"
                  className="block py-2 pl-3 pr-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Home
                </Link>
                <Link
                  href="#"
                  className="block py-2 pl-3 pr-4 md:hover:text-emerald-700 md:p-0 dark:hover:text-emerald-500 "
                >
                  Settings
                </Link>
              </ul>
            )} */}
          </div>
        </div>
        <div className="flex items-center">
          <ul className="hidden md:flex md:font-medium md:flex-row md:space-x-6 md:px-6">
            {pathname === "/signin" && (
              <Link
                href="/homepage"
                className="block py-2 p-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
              >
                about Lisa
              </Link>
            )}
            {/* <Link
              href="#"
              className="block py-2 p-4 md:hover:text-emerald-700 md:p-0 dark:hover:text-emerald-500 "
            >
              Settings
            </Link> */}
          </ul>

          <div className="m-4">
            <ThemeToggler />
          </div>
        </div>
      </div>
    </nav>
  );
}
