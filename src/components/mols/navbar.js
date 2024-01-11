"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { SVGhamburger, SVGlogo } from "../atoms/svgs";
import ThemeToggler from "../atoms/themeToggle";
import { MenuDropdown } from "../atoms/menus";

export default function Navbar(props) {
  const pathname = usePathname();
  return (
    <nav
      className={`sticky bg-backg-surface dark:bg-backg-dark-surface w-full top-0 left-0 border-b border-emerald-800`}
    >
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex flex-row items-center">
          <Link href="/" className="flex items-center">
            <SVGlogo className="h-8 mr-3" />
          </Link>
          <div
            className="hidden md:flex w-full md:w-auto items-center justify-between"
            id="navbar-tab-items"
          >
            <ul className="flex flex-col p-4 ml-2 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {["", "blog", "contacts"].map((v, i) => (
                <Link
                  key={i}
                  href={`/${v}`}
                  className="block py-2 px-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  {v.charAt(0).toUpperCase() + v.slice(1) || "Home"}
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-2 md:px-6">
          <ul className="hidden md:flex md:font-medium md:flex-row md:space-x-4">
            {pathname.includes("/user") ? (
              <Link
                href="/"
                className="block py-2 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Sign Out
              </Link>
            ) : (
              <Link
                href="/signin"
                className="block py-2 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Sign In
              </Link>
            )}
          </ul>
          <div className="flex items-center justify-center mx-4 space-x-4">
            {/* <button
              type="button"
              className="inline-flex md:hidden items-center w-8 h-8 justify-center rounded text-sm hover:text-emerald-500 dark:hover:text-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:focus:ring-emerald-500"
              aria-controls="hamburger-menu-dropdown"
            >
              <span className="sr-only">Open hamburger menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
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
            </button> */}
            <div className="md:hidden">
              <MenuDropdown
                menuIcon={SVGhamburger}
                menuItems={[
                  { label: "Home", type: "link", onClick: "/" },
                  { label: "Blog", type: "link", onClick: "/blog" },
                  { label: "Contacts", type: "link", onClick: "/contacts" },
                ]}
                terminalButton={{
                  label: props.user ? "Sign Out" : "Sign In",
                  onClick: props.user
                    ? async () => {
                        await signOut();
                      }
                    : async () => {
                        await signIn();
                      },
                  type: "button",
                }}
              />
            </div>
            <ThemeToggler />
          </div>
        </div>
      </div>
    </nav>
  );
}
