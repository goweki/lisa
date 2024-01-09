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
          <div
            id="root-div"
            className="flex min-h-screen w-full h-full flex-col"
          >
            {UIstate === "loading" ? <Loader1 /> : children}
            <Toaster />
          </div>
        </SessionProvider>
      </React.StrictMode>
    </ThemeProvider>
  );
}
