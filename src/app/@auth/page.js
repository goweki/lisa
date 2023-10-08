"use client";
import { useState } from "react";
import { Signin } from "@/components/authModals";
import ThemeToggler from "@/components/atoms/themeToggle";

export default function AuthLayout() {
  //states
  const [modal, setModal] = useState("signin");
  return (
    <div className="flex flex-1 flex-col">
      {modal === "signin" && <Signin />}
      <div className="m-4">
        <ThemeToggler />
      </div>
    </div>
  );
}
