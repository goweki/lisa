"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers";
import { User as CaseType } from "@/lib/prisma/types";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader1 } from "@/components/atoms/loader";
import toast from "react-hot-toast";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";

const _defaultUser = {
  name: { value: "", error: "" },
  email: { value: "", error: "" },
  tel: { value: "", error: "" },
};

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userSession, status: authStatus } = useSession();

  // if (status === "authenticated") {
  //   return <p>Signed in as {session.user.email}</p>;
  // }

  const {
    data: { cases },
    refreshData,
  } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("");
  const [filtCases, setFiltCases] = useState<CaseType[]>([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [newUser, setNewUser] = useState(_defaultUser);
  const [userId, setUserId] = useState<string | null>(null);

  //onMount pathname change
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean); // Filter to remove empty segments
      setUserId(pathSegments[2] || null);
    }
    setUIstate("OK");
  }, [pathname]);

  //on input error
  useEffect(() => {
    if (newUser.email.error) toast.error(newUser.email.error);
    if (newUser.name.error) toast.error(newUser.name.error);
    if (newUser.tel.error) toast.error(newUser.tel.error);
    setNewUser((prev) => ({
      ...prev,
      email: { ...prev.email, error: "" },
      name: { ...prev.name, error: "" },
      tel: { ...prev.tel, error: "" },
    }));
  }, [newUser.email.error, newUser.name.error, newUser.tel.error]);

  //filter users by searchPhrase
  useEffect(() => {
    setFiltCases(
      cases?.filter(
        ({ name, email }: { name: string; email: string }) =>
          name.toLowerCase().includes(searchPhrase.value?.toLowerCase()) ||
          email?.toLowerCase().includes(searchPhrase.value?.toLowerCase())
      )
    );
  }, [searchPhrase, cases]);

  //if not admin, re-route to dashboard
  if (userSession?.user?.role !== "admin") {
    return router.push("/dashboard");
  }

  //render
  return UIstate && authStatus === "authenticated" ? (
    <main className="flex bg-muted/10 flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
      {/* <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="w-full gap-2">
        <h1 className="uppercase text-muted-foreground">Cases</h1>
      </div>
      <div className="w-full items-start gap-6 flex flex-col md:flex-row">
        <nav
          className="grid gap-4 text-sm text-muted-foreground w-full col-span-1 max-w-[240px] "
          x-chunk="dashboard-04-chunk-0"
        >
          <Input
            type="text"
            name="search"
            placeholder="search..."
            className="placeholder:italic"
            value={searchPhrase.value}
            onChange={(e) =>
              setSearchPhrase({ ...searchPhrase, value: e.target.value })
            }
          />

          <div className="flex flex-col">
            <Link
              className={`p-2 ${!userId ? "bg-muted/50" : ""}`}
              href="/dashboard/cases"
            >
              + create
            </Link>
            {filtCases.length > 0 &&
              filtCases.map(({ id, name, role, institutions }) => (
                // <Link
                //   key={id}
                //   // className="p-2 hover:bg-muted/25"
                //   className={`p-2 ${userId === id ? "bg-muted/50" : ""}`}
                //   href={`/dashboard/users/${id}`}
                // >
                //   {name}
                // </Link>
                <Link
                  key={id}
                  className={`p-2 hover:bg-muted/25 ${
                    userId === id ? "bg-muted/50" : ""
                  }`}
                  href={`/dashboard/users/${id}`}
                >
                  <div className="font-medium">{name}</div>
                  <div className="hidden text-sm text-muted-foreground/75 md:inline-block italic">
                    {role}:{institutions?.map(({ name }) => name).join(", ")}
                  </div>
                </Link>
              ))}
          </div>
        </nav>

        <div className="col-span-2 w-full">{children}</div>
      </div>
    </main>
  ) : null;
}
