"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
// import { DataContext } from "@/app/";
import { Case as CaseType } from "@/lib/prisma/types";

const rootLink = "/dashboard/cases";
const cases: CaseType[] = [];

export default function ListViewLayout({
  title,
  link = rootLink,
  children,
}: Readonly<{
  title: string;
  link: string;
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { data: userSession, status: authStatus } = useSession();

  //   const {
  //     data: { users, caseTypes, cases },
  //     refreshData,
  //   } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("");
  const [filtCases, setFiltCases] = useState<CaseType[]>([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [caseId, setCaseId] = useState<string | null>(null);

  //onMount pathname change
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean); // Filter to remove empty segments
      setCaseId(pathSegments[2] || null);
    }
    setUIstate("OK");
  }, [pathname]);

  //filter cases by searchPhrase
  useEffect(() => {
    if (cases.length < 1) return;
    setFiltCases(
      cases.filter((case_) => {
        const search_string = searchPhrase.value.toLowerCase();
        let var_string = ""; // Initialize an empty string
        const case_values = Object.values(case_);
        for (const val_ of case_values) {
          if (typeof val_ === "string") {
            var_string += val_.toLowerCase(); // Append the string (lowercased) value to var_string
          }
        }
        return var_string.includes(search_string);
      })
    );
  }, [searchPhrase]);

  //if not admin, re-route to dashboard

  //render
  return UIstate && authStatus === "authenticated" ? (
    <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
      {/* <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="w-full gap-2">
        <h1 className="uppercase">{title}</h1>
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
                !caseId ? "bg-primary/25" : "hover:bg-primary/10"
              }`}
              href={link}
            >
              + create
            </Link>
            {filtCases.length > 0 &&
              filtCases.map(({ id, name, caseType, clientParty }) => (
                // <Link
                //   key={id}
                //   // className="p-2 hover:bg-muted/25"
                //   className={`p-2 ${userId === id ? "bg-muted/50" : ""}`}
                //   href={`/dashboard/cases/${id}`}
                // >
                //   {name}
                // </Link>
                <Link
                  key={id}
                  className={`p-2 rounded ${
                    caseId === id ? "bg-primary/20" : "hover:bg-primary/10"
                  }`}
                  href={`/dashboard/cases/${id}`}
                >
                  <div className="font-medium">{name}</div>
                  <div className="hidden text-sm md:inline-block">
                    {caseType?.name}
                    <div className="italic">{clientParty}</div>
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
