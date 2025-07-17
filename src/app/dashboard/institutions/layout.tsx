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
import { Loader } from "@/components/atoms/loader";
import toast from "react-hot-toast";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";
import { Institution } from "@/types/models";

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

  const {
    data: { institutions, users },
    refreshData,
  } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("loading");
  const [filtInstitutions, setFiltInstitutions] = useState<Institution[]>([]);
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
    setFiltInstitutions(() => {
      const insts_ = institutions?.filter(({ name, location }) => {
        const search = searchPhrase.value?.toLowerCase() ?? "";
        return (
          name.toLowerCase().includes(search) ||
          (location?.toLowerCase()?.includes(search) ?? false)
        );
      });
      return insts_ || [];
    });
  }, [searchPhrase, institutions]);

  //if not admin, re-route to dashboard
  if (
    userSession?.user?.role !== "system" &&
    userSession?.user?.role !== "admin"
  ) {
    return router.push("/dashboard");
  }

  //render
  return UIstate ? (
    <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
      {/* <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="w-full gap-2">
        <h1 className="uppercase">Institutions</h1>
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
                !instId
                  ? "bg-primary/20 border border-1 border-primary"
                  : "hover:bg-primary/10"
              }`}
              href="/dashboard/institutions"
            >
              + create
            </Link>
            {filtInstitutions.length > 0 &&
              filtInstitutions.map(({ id, name }) => (
                <Link
                  key={id}
                  className={`p-2 rounded ${
                    instId === id
                      ? "bg-primary/20 border border-1 border-primary"
                      : "hover:bg-primary/10"
                  }`}
                  href={`/dashboard/institutions/${id}`}
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
