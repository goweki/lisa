import Footer from "@/components/mols/footer";
import Navbar from "@/components/mols/navbar";
import React from "react";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
