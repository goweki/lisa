"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import useRealm from "./realmWeb";

export default function Context({ children, routes }) {
  const { app } = useRealm();
  const { auth, home } = routes;
  return (
    <ThemeProvider enableSystem={false} attribute="class">
      <React.StrictMode>
        <div id="root-div" className="flex w-full h-full flex-col">
          {children}
          {!app?.currentUser ? auth : home}
        </div>
      </React.StrictMode>
    </ThemeProvider>
  );
}
