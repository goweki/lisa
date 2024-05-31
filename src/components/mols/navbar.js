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
      className={`z-40 sticky bg-backg-surface dark:bg-backg-dark-surface w-full top-0 left-0 border-b border-emerald-800`}
    >
      <div className="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center">
            <Link href="/">
              <SVGlogo className="h-8 mr-3" />
            </Link>
          </div>
          <div
            className="hidden md:flex w-full md:w-auto items-center justify-between"
            id="navbar-tab-items"
          >
            <ul className="flex flex-col p-4 ml-2 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {(pathname.includes("/dashboard")
                ? menuItemsOptions.auth
                : menuItemsOptions.unauth
              ).map((v, i) => (
                <Link
                  key={i}
                  href={v.onClick}
                  className={`${
                    pathname === v.onClick ||
                    (pathname.length > 8 &&
                      pathname.slice(0, 10) === v.onClick.slice(0, 10))
                      ? "underline font-bold"
                      : ""
                  } block py-2 px-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700`}
                >
                  {v.label}
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-2 md:px-6">
          <ul className="hidden md:flex md:font-medium md:flex-row md:space-x-4">
            {pathname.includes("/dashboard") ? (
              <Link
                href="/"
                className={`block py-2 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700`}
                onClick={async (e) => {
                  e.preventDefault();
                  await signOut();
                }}
              >
                Sign Out, {props.user.name}
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
            <div className="md:hidden">
              <MenuDropdown
                menuIcon={SVGhamburger}
                menuItems={
                  pathname.includes("/dashboard")
                    ? menuItemsOptions.auth
                    : menuItemsOptions.unauth
                }
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

const menuItemsOptions = {
  unauth: [
    { label: "Home", type: "link", onClick: "/" },
    { label: "Blog", type: "link", onClick: "/blog" },
    { label: "Contacts", type: "link", onClick: "/contacts" },
  ],
  auth: [
    { label: "Home", type: "link", onClick: "/dashboard" },
    { label: "Cases", type: "link", onClick: "/dashboard/cases" },
    { label: "Tasks", type: "link", onClick: "/dashboard/tasks" },
  ],
};
