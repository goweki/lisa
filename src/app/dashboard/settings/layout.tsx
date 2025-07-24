import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./_components/sidebar-nav";
import { BreadCrumb } from "@/components/atoms/breadcrumb";

const rootPath = "/dashboard/settings";

const sidebarNavItems = [
  {
    title: "Profile",
    href: rootPath,
  },
  {
    title: "Appearance",
    href: rootPath + "/appearance",
  },
  {
    title: "Notifications",
    href: rootPath + "/notifications",
  },
];

interface SettingsPageProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsPageProps) {
  return (
    <main className="space-y-6 px-8 py-4 pb-16 flex flex-col flex-1">
      <div className="space-y-0.5">
        {/* <h2 className="text-2xl font-bold tracking-tight">Settings</h2> */}
        <BreadCrumb
          prev={{ label: "Dashboard", href: "/dashboard" }}
          current="Settings"
        />
        <p className="text-muted-foreground hidden sm:block">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="hidden sm:block sm: -mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </main>
  );
}
