import { Fragment } from "react";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

export function MenuDropdown({
  menuIcon: MenuIcon,
  menuText,
  menuItems,
  terminalButton,
}) {
  return (
    <Menu>
      <MenuButton className="flex items-center justify-center w-8 h-8">
        {!!MenuIcon && (
          <MenuIcon className="w-6 h-6 hover:text-emerald-700 dark:hover:text-emerald-500" />
        )}
        {!!menuText && (
          <span className="hover:text-emerald-700 dark:hover:text-emerald-500">
            {menuText}
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
          <div className="p-1 ">
            {menuItems.map((v, i) =>
              menuItem({
                label: v.label || null,
                icon: v.icon || null,
                onClick: v.onClick,
                type: v.type,
                i: v.i,
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

function menuItem({ label, icon: Icon, onClick, type, i }) {
  return (
    <MenuItem key={i || Math.floor(Math.random() * 1000)}>
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
