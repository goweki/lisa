"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SVGhamburger, SVGlogo } from "../atoms/svgs";
import ThemeToggler from "../atoms/themeToggle";
import { MenuDropdown } from "../atoms/menus";

export default function Navbar() {
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
          <ul className="hidden md:flex md:font-medium md:flex-row md:space-x-4 md:px-4">
            {pathname.includes("/user") ? (
              <Link
                href="/"
                className="block py-2 p-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Sign Out
              </Link>
            ) : (
              <Link
                href="/signin"
                className="block py-2 p-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Sign In
              </Link>
            )}
          </ul>
          {pathname.includes("/user") && (
            <>
              <div className="flex items-center justify-center md:hidden w-8 h-8">
                <button className="text-font-inactive dark:text-font-dark-inactive hover:text-emerald-600 dark:hover:text-emerald-500 flex items-center justify-center p-3">
                  <svg
                    fill="currentColor"
                    className="block h-5 w-5"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Options</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                  </svg>
                </button>
              </div>
              {/* <div className="w-8 h-8 overflow-visible">
                {optionsMenu()}
              </div> */}
            </>
          )}
          <div className="flex items-center justify-center mx-4 space-x-2">
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
                  label: "Sign In",
                  onClick: async () => {
                    console.log("ACTION: clicked Logout option");
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
