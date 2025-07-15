"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

import { SVGhamburger, SVGlogo } from "../atoms/svgs";
import ThemeToggler from "../atoms/themeToggle";
import {
  HamburgerDropdown,
  MenuDropdown,
  // NavigationMenuComponent,
} from "../atoms/menus";
import { User } from "@/types/models";
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

export default function Navbar(props: {
  user?: { name: string; systemAdmin: boolean; role: string };
}) {
  const pathname = usePathname();
  return (
    <nav
      className={`z-40 sticky bg-card/50 backdrop-blur-md w-full top-0 left-0 border-b border-border`}
    >
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
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
            <NavigationMenuComponent user={props.user} />
          </div>
        </div>
        <div className="flex items-center space-x-2 px-2 md:px-6">
          <ul className="hidden md:flex md:font-medium md:flex-row md:space-x-4">
            <ThemeToggler />
            {pathname.includes("/dashboard") ? (
              <MenuDropdown
                menuText={props.user?.name}
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
                    ? props.user?.role === "system"
                      ? menuItemsOptions.auth.system
                      : props.user?.role === "admin"
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
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const menuItemsOptions: { [key: string]: any } = {
  unauth: [
    { label: "Home", link: "/" },
    { label: "Blog", link: "/blog" },
    { label: "Contacts", link: "/contacts" },
  ],
  auth: {
    system: [
      { label: "Dashboard", link: "/dashboard" },
      {
        label: "Institutions",
        link: "/dashboard/institutions",
      },
      { label: "Users", link: "/dashboard/users" },
    ],
    admin: [
      { label: "Dashboard", link: "/dashboard" },
      { label: "Users", link: "/dashboard/users" },
      { label: "Cases", link: "/dashboard/cases" },
      { label: "Tasks", link: "/dashboard/tasks" },
    ],
    advocate: [
      { label: "Dashboard", link: "/dashboard" },
      { label: "Cases", link: "/dashboard/cases" },
      { label: "Tasks", link: "/dashboard/tasks" },
    ],
    lawyer: [
      { label: "Dashboard", link: "/dashboard" },
      { label: "Cases", link: "/dashboard/cases" },
      { label: "Tasks", link: "/dashboard/tasks" },
    ],
  },
  user: [{ label: "Settings", link: "/dashboard/settings" }],
};

// Nav Menu
function NavigationMenuComponent(props: {
  user?: { name: string; systemAdmin: boolean; role: string };
}) {
  //
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean); // Remove empty strings

  // Check the last segment and ignore it if it contains numerals (0-9)
  const isId = /\d/.test(segments[segments.length - 1]); // Check if the last segment contains any digit (0-9)
  const relevantSegments = isId ? segments.slice(0, -1) : segments; // Ignore the last segment if it's an ID

  // Join the relevant segments back into a path
  const cleanPathname = "/" + relevantSegments.join("/");

  const { data: authSession, status: authStatus } = useSession();

  const menulinks =
    props.user?.role === "system"
      ? menuItemsOptions.auth.system
      : props.user?.role === "admin"
        ? menuItemsOptions.auth.admin
        : menuItemsOptions.auth.lawyer;

  //render
  if (authSession?.user && menulinks)
    return cleanPathname.includes("/dashboard") ? (
      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          {menulinks.map(({ label, link }: { label: string; link: string }) => (
            <NavigationMenuItem key={label}>
              <Link
                href={link}
                className={`text-foreground hover:underline ${
                  cleanPathname === link ? "font-bold" : "font-light"
                }`}
              >
                {label}
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    ) : (
      <NavigationMenu>
        <NavigationMenuList className="gap-4">
          {menuItemsOptions.unauth.map(
            ({ label, link }: { label: string; link: string }) => (
              <NavigationMenuItem key={label}>
                <Link
                  href={link}
                  className={`text-foreground hover:text-primary ${
                    pathname === link ? "font-bold" : "font-normal"
                  }`}
                >
                  {label}
                </Link>
              </NavigationMenuItem>
            )
          )}
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
