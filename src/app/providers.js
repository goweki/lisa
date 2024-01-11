"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { Loader1 } from "@/components/atoms/loader";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  const [UIstate, setUIstate] = useState("loading");
  // onMount
  useEffect(() => {
    setTimeout(() => setUIstate("OK"), 2000);
  }, []);

  //Render
  return (
    <ThemeProvider defaultTheme="system" attribute="class">
      <React.StrictMode>
        <SessionProvider>
          {UIstate === "loading" ? (
            <div className="flex flex-col min-h-screen justify-center">
              <Loader1 />
            </div>
          ) : (
            children
          )}
          <Toaster />
        </SessionProvider>
      </React.StrictMode>
    </ThemeProvider>
  );
}
