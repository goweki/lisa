"use client";
import { useState } from "react";
import { Signin } from "@/components/mols/authModals";

export default function AuthLayout() {
  //states
  const [modal, setModal] = useState("signin");
  return modal === "signin" ? Signin() : "";
}
