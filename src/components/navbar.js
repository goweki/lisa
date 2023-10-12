"use client";
import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SVGlogo, SVGprofileNavbarIcon } from "./atoms/svgs";
import ThemeToggler from "./atoms/themeToggle";
import { Menu, Transition } from "@headlessui/react";
import useRealm from "./realmWeb";

export default function Navbar() {
  function optionsMenu() {
    return (
      <Menu>
        <Menu.Button className="flex items-center justify-center w-8 h-8">
          <SVGprofileNavbarIcon className="w-6 h-6" />
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
          <Menu.Items className="absolute right-0 mt-2 px-2 origin-top-right divide-y divide-gray-400 rounded bg-background-lyt-raised dark:bg-background-dak-raised shadow-lg border border-gray-200  dark:border-gray-500">
            <div className="px-1 py-1 ">
              {menuItem({ label: "Profile" })}
              {menuItem({ label: "Settings" })}
              {menuItem({ label: "Settings" })}
            </div>
            <div className="px-2 py-1">
              <Menu.Item>
                {menuItem({
                  label: "Logout",
                  onClick: async () => {
                    console.log("ACTION: clicked Logout option");
                    await signOutUser();
                    router.replace("/");
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
  const { signOutUser } = useRealm();
  const router = useRouter();
  return (
    <nav
      className={`sticky bg-background-surface dark:bg-background-dark-surface w-full top-0 left-0 border-b border-emerald-800`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex flex-row items-center">
          <Link href="/" className="flex items-center">
            <SVGlogo className="h-8 mr-3" />
          </Link>
          {/* {pathname.includes("/home") && (
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
          )} */}
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
        <div className="flex items-center space-x-2 px-2 md:px-6">
          <ul className="hidden md:flex md:font-medium md:flex-row md:space-x-4 md:px-4">
            {pathname === "/signin" && (
              <Link
                href="/"
                className="block py-2 p-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700"
              >
                about Lisa
              </Link>
            )}
          </ul>
          {/* {pathname.includes("/home") && (
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
          )} */}

          {pathname === "/home" && (
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
          )}
          {/* options dropdown */}
          {pathname === "/home" && (
            <div className="w-8 h-8 overflow-visible">
              {/* <button className="text-font-faded dark:text-font-dark-faded hover:text-emerald-600 dark:hover:text-emerald-500 flex items-center justify-center p-3">
                <SVGprofileNavbarIcon className="w-6 h-6" />
              </button> */}
              {optionsMenu()}
            </div>
          )}
          <div className="overflow-visible flex items-center justify-center w-8 h-8">
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
            active ? "bg-primary-light dark:bg-primary-dark" : ""
          } flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          {!!Icon && <Icon className="mr-2 h-5 w-5" />}
          {label}
        </button>
      )}
    </Menu.Item>
  );
}
