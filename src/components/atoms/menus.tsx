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
      <MenuButton className="flex items-center justify-center w-fit px-2 py-2 rounded data-[open]:bg-popover">
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
        <MenuItems className="absolute top-12 right-24 origin-top-right divide-y divide-border/50 rounded bg-popover text-popover-foreground shadow-lg border border-border">
          {/* right-0 */}
          <div className="p-1 ">
            {menuItems.map((v: any, i: Number) =>
              menuItem({
                label: (v.label as string) || "",
                icon: v.icon || null,
                link: v.link,
              })
            )}
          </div>
          {terminalButton && (
            <div className="p-1">
              <MenuItem>
                <button
                  onClick={terminalButton.onClick}
                  className={`hover:bg-primary hover:text-primary-foreground flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
                >
                  {terminalButton.label}
                </button>
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
        {!!MenuIcon && <MenuIcon className="w-6 h-6 hover:text-primary" />}
        {!!menuText && (
          <span className="flex flex-row items-center mr-2 hover:text-primary flex-nowrap">
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
        <MenuItems className="absolute right-0 origin-top-right divide-y divide-border rounded bg-popover text-popover-foreground shadow-lg border border-border">
          {/* right-0 */}
          <div className="p-1 ">
            {menuItems.map((v: any, i: Number) =>
              menuItem({
                label: v.label || null,
                icon: v.icon || null,
                link: v.link,
              })
            )}
          </div>
          {terminalButton && (
            <div className="p-1">
              <MenuItem>
                <button
                  onClick={terminalButton.onClick}
                  className={`hover:bg-primary hover:text-primary-foreground flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
                >
                  {terminalButton.label}
                </button>
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
  link,
}: {
  label: string;
  icon?: any;
  link: string;
}) {
  return (
    <MenuItem key={Math.floor(Math.random() * 1000)}>
      {({ focus }) => (
        <Link
          href={link}
          className={`${
            focus ? "bg-primary text-primary-foreground" : ""
          } buttony flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
        >
          {!!Icon && <Icon className="mr-2 h-5 w-5" />}
          {!!label && label}
        </Link>
      )}
    </MenuItem>
  );
}
