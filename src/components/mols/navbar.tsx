"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { SVGhamburger, SVGlogo } from "../atoms/svgs";
import ThemeToggler from "../atoms/themeToggle";
import {
  HamburgerDropdown,
  MenuDropdown,
  // NavigationMenuComponent,
} from "../atoms/menus";
import { User } from "@/lib/prisma/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export default function Navbar(props: { user?: Partial<User> }) {
  const pathname = usePathname();
  return (
    <nav
      className={`z-40 sticky bg-muted/20 backdrop-blur-md w-full top-0 left-0 border-b border-emerald-800`}
    >
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center">
            <Link href="/">
              <SVGlogo className="h-8 mr-3" />
            </Link>
          </div>
          {/* {!pathname.includes("/settings") && (
            <div
              className="hidden md:flex w-full md:w-auto items-center justify-between"
              id="navbar-tab-items"
            >
              <ul className="flex flex-col p-4 ml-2 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0">
                {(pathname.includes("/dashboard")
                  ? props.user?.role === "admin"
                    ? menuItemsOptions.auth.admin
                    : menuItemsOptions.auth.lawyer
                  : menuItemsOptions.unauth
                ).map((v, i) => (
                  <Link
                    key={i}
                    href={v.onClick}
                    className={`${
                      pathname === v.onClick ||
                      pathname.includes(v.label.toLowerCase())
                        ? "underline font-bold"
                        : ""
                    } block py-2 px-4 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700`}
                  >
                    {v.label}
                  </Link>
                ))}
              </ul>
            </div>
          )} */}
          <div
            className="hidden md:flex w-full md:w-auto items-center justify-between"
            id="navbar-tab-items"
          >
            <NavigationMenuComponent />
          </div>
        </div>
        <div className="flex items-center space-x-2 px-2 md:px-6">
          <ul className="hidden md:flex md:font-medium md:flex-row md:space-x-4">
            {pathname.includes("/dashboard") ? (
              // <Link
              //   href="/"
              //   className={`block py-2 rounded  md:hover:bg-transparent md:hover:text-emerald-700 md:p-0 md:dark:hover:text-emerald-500  dark:hover:bg-gray-700  md:dark:hover:bg-transparent dark:border-gray-700`}
              //   onClick={async (e) => {
              //     e.preventDefault();
              //     await signOut();
              //   }}
              // >
              //   Sign Out
              // </Link>
              <MenuDropdown
                menuText={props.user?.name as string}
                // menuIcon={User}
                menuItems={menuItemsOptions.user}
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
              <HamburgerDropdown
                menuIcon={SVGhamburger}
                menuItems={
                  pathname.includes("/dashboard")
                    ? props.user?.role === "admin"
                      ? menuItemsOptions.auth.admin
                      : menuItemsOptions.auth.lawyer
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
            {/* <ThemeToggler /> */}
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
  auth: {
    admin: [
      { label: "Home", type: "link", onClick: "/dashboard" },
      {
        label: "Institutions",
        type: "link",
        onClick: "/dashboard/institutions",
      },
      { label: "Users", type: "link", onClick: "/dashboard/users" },
      { label: "Cases", type: "link", onClick: "/dashboard/cases" },
      { label: "Tasks", type: "link", onClick: "/dashboard/tasks" },
    ],
    lawyer: [
      { label: "Home", type: "link", onClick: "/dashboard" },
      { label: "Cases", type: "link", onClick: "/dashboard/cases" },
      { label: "Tasks", type: "link", onClick: "/dashboard/tasks" },
    ],
  },
  user: [{ label: "Settings", type: "link", onClick: "/dashboard/settings" }],
};

// Nav Menu
const components: { title: string; href: string; description: string }[] = [
  {
    title: "Institutions",
    href: "/dashboard/institutions",
    description: "Legal firms and entities ",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    description: "Administrators and Lawyers",
  },
  {
    title: "Cases",
    href: "/dashboard/cases",
    description: "View all your legal issues",
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    description: "View activities requisite to cases.",
  },
  // {
  //   title: "Tabs",
  //   href: "/docs/primitives/tabs",
  //   description:
  //     "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  // },
  // {
  //   title: "Tooltip",
  //   href: "/docs/primitives/tooltip",
  //   description:
  //     "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  // },
];

// Nav Menu
function NavigationMenuComponent() {
  const pathname = usePathname();

  //render
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-4">
        <NavigationMenuItem>
          {/* <Link href="/dashboard"> */}
          <NavigationMenuLink
            className={`text-foreground hover:text-foreground ${
              pathname === "/dashboard"
                ? "bg-muted/50 hover:bg-muted/50"
                : "bg-transparent"
            } ${navigationMenuTriggerStyle()} `}
            href="/dashboard"
          >
            Dashboard
          </NavigationMenuLink>
          {/* </Link> */}
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`bg-transparent focus:bg-transparent ${
              pathname.includes("/institutions") ||
              pathname.includes("/users") ||
              pathname.includes("/cases") ||
              pathname.includes("/tasks")
                ? "bg-muted/50 hover:bg-muted/50"
                : ""
            }`}
          >
            Manager
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  className="my-auto hover:bg-muted/25 border-2 border-transparent hover:border-border hover:border-2 hover:shadow-sm"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/dashboard/settings" legacyBehavior passHref>
            <NavigationMenuLink
              // className={navigationMenuTriggerStyle() + " bg-transparent"}
              className={`${
                pathname === "/dashboard/settings"
                  ? "bg-muted"
                  : "bg-transparent"
              } ${navigationMenuTriggerStyle()} `}
            >
              Settings
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
