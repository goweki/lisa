// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// export default async function InstitutionsLayout({ children }) {
//   const session = await getServerSession(authOptions);
//   if (session?.user?.role === "admin") {
//     // user is admin
//     return children;
//   } else redirect(`/dashboard`);
// }

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
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader1 } from "@/components/atoms/loader";
import toast from "react-hot-toast";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";

const _defaultInstitution = {
  name: { value: "", error: "" },
  email: { value: "", error: "" },
  tel: { value: "", error: "" },
};

export default function InstitutionsPage({
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
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("");
  const [filtInstitutions, setFiltInstitutions] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [newInstitution, setNewInstitution] = useState(_defaultInstitution);
  const [instId, setInstId] = useState<string | null>(null);

  //onMount pathname change
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean); // Filter to remove empty segments
      setInstId(pathSegments[2] || null);
    }
    setUIstate("OK");
  }, [pathname]);

  //on input error
  useEffect(() => {
    if (newInstitution.email.error) toast.error(newInstitution.email.error);
    if (newInstitution.name.error) toast.error(newInstitution.name.error);
    if (newInstitution.tel.error) toast.error(newInstitution.tel.error);
    setNewInstitution((prev) => ({
      ...prev,
      email: { ...prev.email, error: "" },
      name: { ...prev.name, error: "" },
      tel: { ...prev.tel, error: "" },
    }));
  }, [
    newInstitution.email.error,
    newInstitution.name.error,
    newInstitution.tel.error,
  ]);

  //filter institutions by searchPhrase
  useEffect(() => {
    setFiltInstitutions(
      institutions?.filter(
        ({ name, location }: { name: string; location: string }) =>
          name.toLowerCase().includes(searchPhrase.value?.toLowerCase()) ||
          location?.toLowerCase().includes(searchPhrase.value?.toLowerCase())
      )
    );
  }, [searchPhrase, institutions]);

  //if not admin, re-route to dashboard
  if (userSession?.user?.role !== "admin") {
    return router.push("/dashboard");
  }

  //render
  return UIstate && authStatus === "authenticated" ? (
    <main className="flex bg-muted/10 flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
      {/* <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="w-full gap-2">
        <h1 className="uppercase text-muted-foreground">Users</h1>
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
              className={`p-2 ${!instId ? "bg-muted/50" : ""}`}
              href="/dashboard/institutions"
            >
              + create
            </Link>
            {filtInstitutions.length > 0 &&
              filtInstitutions.map(({ id, name }) => (
                <Link
                  key={id}
                  // className="p-2 hover:bg-muted/25"
                  className={`p-2 ${instId === id ? "bg-muted/50" : ""}`}
                  href={`/dashboard/users/${id}`}
                >
                  {name}
                </Link>
              ))}
          </div>
        </nav>

        <div className="col-span-2 w-full">{children}</div>
      </div>
    </main>
  ) : null;
}
