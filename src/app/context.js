"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import useRealm from "../components/realmWeb";

export default function Context({ routes, navbar: Navbar }) {
  const [loading, setLoading] = useState(true);
  const { app } = useRealm();
  const { auth, home } = routes;
  // onMount - delay
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <ThemeProvider enableSystem={false} attribute="class">
      <React.StrictMode>
        <div id="root-div" className="flex min-h-screen w-full h-full flex-col">
          {!loading && <Navbar />}
          {loading ? (
            <div className="py-2 md:py-6 items-center justify-center space-x-2 pt-1 loader [&>*:nth-child(even)]:bg-emerald-600 [&>*:nth-child(odd)]:bg-gray-500 rounded-full flex">
              <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] "></div>
              <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-200"></div>
              <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-400"></div>
              <div className="w-4 h-4 rounded-full animate-[loader_0.6s_infinite_alternate] animation-delay-600"></div>
            </div>
          ) : app?.currentUser ? (
            home
          ) : (
            auth
          )}

          <Toaster />
        </div>
      </React.StrictMode>
    </ThemeProvider>
  );
}
