"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { SVGhamburger, SVGlogo } from "../atoms/svgs";
import ThemeToggler from "../atoms/themeToggle";
import { MenuDropdown } from "../atoms/menus";

export default function Navbar() {
  function optionsMenu({ menu: MainMenu, menuItems }) {
    return (
      <Menu>
        <Menu.Button className="flex items-center justify-center w-8 h-8">
          <MainMenu className="w-6 h-6 hover:text-emerald-700 dark:hover:text-emerald-500" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 origin-top-right divide-y divide-gray-400 rounded bg-background-raised dark:bg-background-dark-raised shadow-lg border border-emerald-500  dark:border-emerald-800">
            <div className="px-1 py-1 ">
              {["Settings", "Profile"].map((v) => menuItem({ label: v }))}
              {/* {menuItem({ label: "Settings" })}
              {menuItem({ label: "Profile" })} */
              /* {menuItem({ label: "Settings" })} */}
            </div>
            <div className="px-2 py-1">
              <Menu.Item>
                {menuItem({
                  label: "Logout",
                  onClick: async () => {
                    console.log("ACTION: clicked Logout option");
                  },
                })}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

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
                href=""
                className="block py-2 p-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Sign Out
              </Link>
            ) : (
              <Link
                href="/auth/signin"
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
              />
            </div>
            <ThemeToggler />
          </div>
        </div>
      </div>
    </nav>
  );
}

function menuItem({ label, icon: Icon, onClick }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`${
            active ? "bg-emerald-300 dark:bg-emerald-900" : ""
          } flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
        >
          {!!Icon && <Icon className="mr-2 h-5 w-5" />}
          {!!label && label}
        </button>
      )}
    </Menu.Item>
  );
}
