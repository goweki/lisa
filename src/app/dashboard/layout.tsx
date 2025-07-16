import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Footer from "@/components/mols/footer";
import Navbar from "@/components/mols/navbar";
import UserProviders from "./providers";
import React from "react";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  else
    return (
      <UserProviders>
        <Navbar user={session.user} />
        {children}
        <Footer />
      </UserProviders>
    );
}
