"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export function MenuDropdown({
  menuIcon: MenuIcon,
  menuText,
  menuItems,
  terminalButton,
}: {
  menuIcon?: any;
  menuText?: string;
  menuItems: any;
  terminalButton: any;
}) {
  return (
    <Menu>
      <MenuButton className="flex items-center justify-center w-fit px-2 py-2 rounded data-[open]:bg-muted">
        {!!MenuIcon && (
          <MenuIcon className="w-6 h-6 hover:text-emerald-700 dark:hover:text-emerald-500" />
        )}
        {!!menuText && (
          <span className="flex flex-row items-center mr-2 hover:text-emerald-700 dark:hover:text-emerald-500 flex-nowrap">
            {menuText} <ChevronDown className="w-4 h-4" />
          </span>
        )}
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute top-12 right-24 origin-top-right divide-y divide-gray-400 rounded bg-backg-raised dark:bg-backg-dark-raised shadow-lg border border-emerald-500  dark:border-emerald-800">
          {/* right-0 */}
          <div className="p-1 ">
            {menuItems.map((v: any, i: Number) =>
              menuItem({
                label: (v.label as string) || "",
                icon: v.icon || null,
                onClick: v.onClick,
                type: v.type,
                // i: v.i,
              })
            )}
          </div>
          {terminalButton && (
            <div className="p-1">
              <MenuItem>
                {menuItem({
                  label: terminalButton.label || "",
                  icon: terminalButton.icon || null,
                  onClick: terminalButton.onClick,
                  type: terminalButton.type,
                })}
              </MenuItem>
            </div>
          )}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

export function HamburgerDropdown({
  menuIcon: MenuIcon,
  menuText,
  menuItems,
  terminalButton,
}: {
  menuIcon?: any;
  menuText?: string;
  menuItems: any;
  terminalButton: any;
}) {
  return (
    <Menu>
      <MenuButton className="flex items-center justify-center w-fit px-2 py-2 rounded data-[open]:bg-muted">
        {!!MenuIcon && (
          <MenuIcon className="w-6 h-6 hover:text-emerald-700 dark:hover:text-emerald-500" />
        )}
        {!!menuText && (
          <span className="flex flex-row items-center mr-2 hover:text-emerald-700 dark:hover:text-emerald-500 flex-nowrap">
            {menuText} <ChevronDown className="w-4 h-4" />
          </span>
        )}
      </MenuButton>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 origin-top-right divide-y divide-gray-400 rounded bg-backg-raised dark:bg-backg-dark-raised shadow-lg border border-emerald-500  dark:border-emerald-800">
          {/* right-0 */}
          <div className="p-1 ">
            {menuItems.map((v: any, i: Number) =>
              menuItem({
                label: v.label || null,
                icon: v.icon || null,
                onClick: v.onClick,
                type: v.type,
                // i: v.i,
              })
            )}
          </div>
          {terminalButton && (
            <div className="p-1">
              <MenuItem>
                {menuItem({
                  label: terminalButton.label,
                  onClick: terminalButton.onClick,
                  type: terminalButton.type,
                })}
              </MenuItem>
            </div>
          )}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

function menuItem({
  label,
  icon: Icon,
  onClick,
  type,
}: // i,
{
  label: string;
  icon?: any;
  onClick: any;
  type: string;
  // i: any;
}) {
  return (
    <MenuItem key={Math.floor(Math.random() * 1000)}>
      {({ focus }) =>
        type === "button" ? (
          <button
            onClick={onClick}
            className={`${
              focus ? "bg-emerald-300 dark:bg-emerald-800" : ""
            } flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
          >
            {!!Icon && <Icon className="mr-2 h-5 w-5" />}
            {!!label && label}
          </button>
        ) : (
          <Link
            href={onClick}
            className={`${
              focus
                ? "bg-emerald-300 dark:bg-emerald-800 text-font dark:text-font-dark"
                : ""
            } buttony flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
          >
            {!!Icon && <Icon className="mr-2 h-5 w-5" />}
            {!!label && label}
          </Link>
        )
      }
    </MenuItem>
  );
}

// const components: { title: string; href: string; description: string }[] = [
//   {
//     title: "Alert Dialog",
//     href: "/docs/primitives/alert-dialog",
//     description:
//       "A modal dialog that interrupts the user with important content and expects a response.",
//   },
//   {
//     title: "Hover Card",
//     href: "/docs/primitives/hover-card",
//     description:
//       "For sighted users to preview content available behind a link.",
//   },
//   {
//     title: "Progress",
//     href: "/docs/primitives/progress",
//     description:
//       "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
//   },
//   {
//     title: "Scroll-area",
//     href: "/docs/primitives/scroll-area",
//     description: "Visually or semantically separates content.",
//   },
//   {
//     title: "Tabs",
//     href: "/docs/primitives/tabs",
//     description:
//       "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
//   },
//   {
//     title: "Tooltip",
//     href: "/docs/primitives/tooltip",
//     description:
//       "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
//   },
// ];

// export function NavigationMenuComponent() {
//   return (
//     <NavigationMenu>
//       <NavigationMenuList>
//         <NavigationMenuItem>
//           <Link href="/docs" legacyBehavior passHref>
//             <NavigationMenuLink
//               className={navigationMenuTriggerStyle() + " bg-transparent"}
//             >
//               Documentation
//             </NavigationMenuLink>
//           </Link>
//         </NavigationMenuItem>

//         <NavigationMenuItem>
//           <NavigationMenuTrigger className="bg-transparent">
//             Components
//           </NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//               {components.map((component) => (
//                 <ListItem
//                   key={component.title}
//                   title={component.title}
//                   href={component.href}
//                 >
//                   {component.description}
//                 </ListItem>
//               ))}
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>

//         <NavigationMenuItem>
//           <Link href="/docs" legacyBehavior passHref>
//             <NavigationMenuLink
//               className={navigationMenuTriggerStyle() + " bg-transparent"}
//             >
//               Documentation
//             </NavigationMenuLink>
//           </Link>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// }

// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   );
// });
// ListItem.displayName = "ListItem";
