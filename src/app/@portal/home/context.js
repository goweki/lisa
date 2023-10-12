"use client";
import { useState } from "react";

export function Context({ routes }) {
  const [activeRoute, setRoute] = useState("home");
  const { home, settings } = routes;
  return activeRoute === "home"
    ? home
    : activeRoute === "settings"
    ? settings
    : null;
}
