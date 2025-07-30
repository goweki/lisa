"use client";

import React from "react";
import Link from "next/link";
import { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Loader } from "@/components/atoms/loader";
import { Case, Institution, User } from "@/types/models";
import {
  AssigneeRequest,
  CaseType,
  PaymentTransaction,
  Task,
} from "@prisma/client";
import { UIstate } from "@/types/custom";
import PaymentsSection from "@/components/payments";
import { showWarningToast } from "@/components/atoms/customToast";
import { signOut } from "next-auth/react";

export interface UIDATA {
  users: User[];
  plans: [];
  caseTypes: CaseType[];
  cases: Case[];
  tasks: Task[];
  payments: PaymentTransaction[];
  institutions?: Institution[];
  assignmentRequests?: AssigneeRequest[];
}

interface DataContext {
  data: UIDATA;
  refreshData: () => Promise<void>;
}

export const defaultDataContext: DataContext = {
  data: {
    users: [],
    plans: [],
    caseTypes: [],
    cases: [],
    tasks: [],
    payments: [],
  },
  refreshData: async () => {
    console.log(
      "Default refreshData called. No actual data fetching configured."
    );
    return Promise.resolve(); // Resolves immediately as it's a placeholder
  },
};

export const DataContext = createContext<DataContext>(defaultDataContext);

export default function UserProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [data, setData] = useState<UIDATA>(defaultDataContext.data);
  const [UIstate, setUIstate] = useState<UIstate>("loading");

  // fetch UI data
  const fetchUIuserData = useCallback(async () => {
    try {
      const fetchOptions = {
        method: "GET",
      };
      const response = await fetch(`/api/dashboard/data`, fetchOptions).then(
        async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else if (res_.status === 402) {
            showWarningToast("Payment required");
            setUIstate("payment-required");
          } else {
            //CHECKPOINT
            const error_ = await res_.json();
            console.error(
              `ERROR: ` + error_ || "Error fetching dashboard data"
            );
            toast.error(error_);
            setUIstate("data-error");
          }
        }
      );

      if (!response) {
        return;
      }
      console.log("UI data", response);
      setData(response);
      setUIstate("OK");
    } catch (err) {
      setUIstate("data-error");
      console.error("ERROR: caught error\n > " + err);
    }
  }, [session]);

  // onMount
  useEffect(() => {
    if (session) {
      fetchUIuserData();
    }
  }, [session, fetchUIuserData]);

  //render
  return UIstate === "loading" || status === "loading" ? (
    <div className="flex flex-col sm:h-[200px] md:h-[300px] lg:h-[400px] justify-center">
      <Loader />
    </div>
  ) : UIstate === "data-error" ? (
    <MessageLayout message="Couldn't fetch data. Try again later" />
  ) : UIstate === "payment-required" ? (
    <PaymentsSection exit={signOut} />
  ) : (
    <EdgeStoreProvider>
      <DataContext.Provider value={{ data, refreshData: fetchUIuserData }}>
        {children}
      </DataContext.Provider>
    </EdgeStoreProvider>
  );
}

function MessageLayout({ message }: { message: string }) {
  return (
    <div className="mt-12">
      <div className="flex flex-col gap-y-4">
        <p className="text-center m-auto max-w-4xl px-2 md:px-8">
          There was an error loading the contents of this page. {message}
        </p>
        <p className="text-center">
          <Link href="/" className="text-red-800 dark:text-red-400 underline">
            click here{" "}
          </Link>
          to go to homepage
        </p>
      </div>
    </div>
  );
}
