import { redirect } from "next/navigation";
import Footer from "@/components/mols/footer";
import Navbar from "@/components/mols/navbar";
import UserProviders from "./providers";
import React from "react";
import { auth } from "@/lib/auth";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/signin");
  else
    return (
      <UserProviders>
        <Navbar />
        {children}
        <Footer />
      </UserProviders>
    );
}
