import { Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";

export function MenuDropdown({ menuIcon: MenuIcon, menuText, menuItems }) {
  return (
    <Menu>
      <Menu.Button className="flex items-center justify-center w-8 h-8">
        {!!MenuIcon && (
          <MenuIcon className="w-6 h-6 hover:text-emerald-700 dark:hover:text-emerald-500" />
        )}
        {!!menuText && (
          <span className="hover:text-emerald-700 dark:hover:text-emerald-500">
            {menuText}
          </span>
        )}
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
        <Menu.Items className="absolute right-0 origin-top-right divide-y divide-gray-400 rounded bg-backg-raised dark:bg-backg-dark-raised shadow-lg border border-emerald-500  dark:border-emerald-800">
          <div className="px-1 py-1 ">
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
          <div className="px-2 py-1">
            <Menu.Item>
              {menuItem({
                label: "Sign In",
                onClick: async () => {
                  console.log("ACTION: clicked Logout option");
                },
                type: "button",
              })}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function menuItem({ label, icon: Icon, onClick, type, i }) {
  return (
    <Menu.Item key={i || Math.floor(Math.random() * 100)}>
      {({ active }) =>
        type === "button" ? (
          <button
            onClick={onClick}
            className={`${
              active ? "bg-emerald-300 dark:bg-emerald-800" : ""
            } flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
          >
            {!!Icon && <Icon className="mr-2 h-5 w-5" />}
            {!!label && label}
          </button>
        ) : (
          <Link
            href={onClick}
            className={`${
              active
                ? "bg-emerald-300 dark:bg-emerald-800 text-font dark:text-font-dark"
                : ""
            } buttony flex w-full items-center rounded pl-2 pr-4 py-2 text-sm`}
          >
            {!!Icon && <Icon className="mr-2 h-5 w-5" />}
            {!!label && label}
          </Link>
        )
      }
    </Menu.Item>
  );
}
