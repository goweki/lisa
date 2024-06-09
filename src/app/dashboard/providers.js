"use client";
import Link from "next/link";
import { createContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Loader1 } from "@/components/atoms/loader";
import { httpCodes } from "@/lib/configs";
export const DataContext = createContext();

export default function Providers({ children }) {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  // func update UI data
  const fetchUIuserData = useCallback(async () => {
    try {
      const fetchOptions = {
        method: "GET",
      };
      console.log("FETCHING: ", session.user.institutionIDs[0]);
      // const response = await fetch(
      //   `/api/dashboard/data?institution=${session.user.institutionIDs[0]}`,
      //   fetchOptions
      // );
      // POST request using fetch
      const response = await fetch(
        `/api/dashboard/data?institution=${session.user.institutionIDs[0]}`,
        fetchOptions
      ).then(async (res_) => {
        if (res_?.status === 200) {
          return await res_.json();
        } else {
          console.log(`ERROR: ` + JSON.stringify(res_));
          toast.error(httpCodes[res_?.status] ?? "Unknown error");
        }
      });

      // console.log("RESPONSE", json_);
      if (response?.success) {
        setData(response.success);
      } else {
        console.error(
          "FAILED: could not fetch data\n > " +
            (response?.failed ?? response?.error ?? "Unknown error")
        );
        setData("failed");
      }
    } catch (err) {
      setData("failed");
      console.error("ERROR: caught error\n > " + err);
    }
  }, [session?.user?.institutionIDs]);

  // onMount
  useEffect(() => {
    if (session) {
      fetchUIuserData();
    }
  }, [session, fetchUIuserData]);

  //render
  return !session || !data || status === "loading" ? (
    <Loader1 />
  ) : data === "failed" ? (
    <div className="mt-12">
      <p className="text-center">
        There was an error loading the contents of this page. Try again later.
      </p>
      <p className="text-center">
        <Link href="/" className="text-red-800 dark:text-red-400 underline">
          click here{" "}
        </Link>
        to go to homepage
      </p>
    </div>
  ) : (
    <EdgeStoreProvider>
      <DataContext.Provider value={{ data, refreshData: fetchUIuserData }}>
        {children}
      </DataContext.Provider>
    </EdgeStoreProvider>
  );
}
