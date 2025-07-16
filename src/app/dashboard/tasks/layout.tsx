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
import { Case as CaseType, Task } from "@/types/models";
import { ButtonPrimary } from "@/components/atoms/buttons";
import { Loader1 } from "@/components/atoms/loader";
import toast from "react-hot-toast";
import {
  emailValidator,
  nameValidator,
  telValidator,
} from "@/helpers/inputValidators";
import { httpCodes } from "@/lib/configs";
import { caseStatus } from "@prisma/client";

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userSession, status: authStatus } = useSession();

  const {
    data: { users, caseTypes, cases, tasks },
    refreshData,
  } = useContext(DataContext);

  const [UIstate, setUIstate] = useState("");
  const [filtTasks, setFiltTasks] = useState<Task[]>([]);
  const [searchPhrase, setSearchPhrase] = useState({ value: "", error: "" });
  const [taskId, setTaskId] = useState<string | null>(null);

  //onMount pathname change
  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean); // Filter to remove empty segments
      setTaskId(pathSegments[2] || null);
    }
    setUIstate("OK");
  }, [pathname]);

  //filter tasks by searchPhrase
  useEffect(() => {
    const filtTasks = tasks?.filter(({ name, type, description = "" }) =>
      [name, type, description]
        .join(" ")
        .toLowerCase()
        .includes(searchPhrase.value?.toLowerCase())
    );
    setFiltTasks(filtTasks || []);
  }, [searchPhrase, tasks]);

  //if not admin, re-route to dashboard

  //render
  return UIstate && authStatus === "authenticated" ? (
    <main className="flex flex-col flex-1 gap-4 p-4 md:gap-8 md:p-10">
      {/* <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"> */}
      <div className="w-full gap-2">
        <h1 className="uppercase">Tasks</h1>
      </div>
      <div className="block">{children}</div>
    </main>
  ) : null;
}
