"use client";
import { useState } from "react";
import { Signin } from "@/app/@auth/signin/compo";
import ThemeToggler from "@/components/atoms/themeToggle";

export default function SignInPage() {
  //states
  const [modal, setModal] = useState("signin");
  return (
    <div className="flex flex-1 flex-col">
      {modal === "signin" && <Signin />}
    </div>
  );
}
