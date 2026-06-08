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
import { User } from "@/types/models";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader } from "@/components/atoms/loader";
import toast from "react-hot-toast";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/lib/utils/inputValidators";
import { httpCodes } from "@/lib/configs";
import { EntityStatus } from "@prisma/client";

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  // if (status === "authenticated") {
  //   return <p>Signed in as {session.user.email}</p>;
  // }

  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("");
  const [filtUsers, setFiltUsers] = useState<User[]>([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [userId, setUserId] = useState<string | null>(null);

  //onMount pathname change
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean); // Filter to remove empty segments
      setUserId(pathSegments[2] || null);
    }
    setUIstate("OK");
  }, [pathname]);

  //filter users by searchPhrase
  useEffect(() => {
    setFiltUsers(() => {
      const insts_ = users?.filter(({ names, email }) => {
        const search = searchPhrase.value?.toLowerCase() ?? "";
        return (
          names.toLowerCase().includes(search) ||
          (email?.toLowerCase()?.includes(search) ?? false)
        );
      });
      return insts_ || [];
    });
  }, [searchPhrase, users]);

  //if not admin, re-route to dashboard
  if (!session?.user?.systemAdmin) {
    return router.push("/dashboard");
  }

  //render
  return UIstate && authStatus === "authenticated" ? (
    <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
      {/* <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="w-full gap-2">
        <h1 className="uppercase">Users</h1>
      </div>
      <div className="w-full items-start gap-6 flex flex-col md:flex-row">
        <nav
          className="grid gap-4 w-full col-span-1 max-w-[240px] "
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

          <div className="flex flex-col space-y-1">
            <Link
              className={`p-2 rounded ${
                !userId
                  ? "bg-primary/20 border border-1 border-primary"
                  : "hover:bg-primary/10"
              }`}
              href="/dashboard/users"
            >
              + create
            </Link>
            {filtUsers.length > 0 &&
              filtUsers
                .filter(({ id }) => id !== session.user?.id)
                .map(({ id, names, status, institutions: userInsts }) => (
                  <Link
                    key={id}
                    className={`p-2 rounded ${
                      userId === id
                        ? "bg-primary/20 border border-1 border-primary"
                        : "hover:bg-primary/10"
                    }`}
                    href={`/dashboard/users/${id}`}
                  >
                    <div className="flex flex-row">
                      {names}{" "}
                      <div
                        className={`w-2 h-2 ${status === EntityStatus.ACTIVE ? "bg-green-500" : status === EntityStatus.DORMANT ? "bg-yellow-500" : "bg-muted-foreground"} rounded-full ml-2 my-auto`}
                      ></div>
                    </div>
                    <div className={`hidden text-sm md:inline-block`}>
                      <span className="mr-2 italic">
                        {userInsts
                          ?.map(({ institutionId }) => {
                            const institution_ = institutions?.find(
                              ({ id }) => id === institutionId,
                            );
                            return institution_?.name;
                          })
                          .join(", ")}
                      </span>{" "}
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
