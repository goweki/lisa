"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import useRealm from "./realmWeb";

export default function Context({ routes }) {
  const { app } = useRealm();
  const { auth, home } = routes;
  return (
    <ThemeProvider enableSystem={false} attribute="class">
      <React.StrictMode>{!app?.currentUser ? auth : home}</React.StrictMode>
    </ThemeProvider>
  );
}
