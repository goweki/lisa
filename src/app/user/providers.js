"use client";
import Link from "next/link";
import { createContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Loader1 } from "@/components/atoms/loader";
export const DataContext = createContext();

export default function Providers({ children }) {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  //onMount
  useEffect(() => {
    if (session) {
      const fetchOptions = {
        method: "GET",
      };
      //   console.log(`...........................\nCHECKPOINT: fetching ui data:`);
      fetch(
        `/api/user/data?institution=${Object.keys(session.user.role)[0]}`,
        fetchOptions
      )
        .then((res_) => res_.json())
        .then((json_) => {
          if (json_.success) {
            // console.log(`> SUCCESS: ${json_.success.length} Documents fetched`);
            setData(json_.success);
          } else {
            console.error(
              "................\nFAILED: could not fetch products\n > " +
                JSON.stringify(json_.error ?? "....")
            );
            setData("failed");
          }
        })
        .catch((err) => {
          setData("failed");
          console.error("ERROR: caught error\n > " + err);
        });
    }
  }, [session]);
  //render
  return !session || !data || status === "loading" ? (
    <Loader1 />
  ) : data === "failed" ? (
    <div>
      <p className="text-center">
        There was an error loading the contents of this page. Check internet
        connectivity
      </p>
      <p className="text-center">
        <Link href="/" className="text-red-800 dark:text-red-400 underline">
          click here{" "}
        </Link>
        to go to homepage
      </p>
    </div>
  ) : (
    <DataContext.Provider value={data}>{children}</DataContext.Provider>
  );
}
