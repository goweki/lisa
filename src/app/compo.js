"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import useRealm from "../components/realmWeb";

export default function Context({ routes, navbar: Navbar }) {
  const [loading, setLoading] = useState(true);
  const { app } = useRealm();
  const { auth, home } = routes;
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <ThemeProvider enableSystem={false} attribute="class">
      <React.StrictMode>
        <div id="root-div" className="flex w-full h-full flex-col">
          <Navbar />
          {!app?.currentUser ? auth : home}
          <Toaster />
        </div>
      </React.StrictMode>
    </ThemeProvider>
  );
}
