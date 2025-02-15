import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SVGdarktTheme, SVGlightTheme } from "./svgs";

export default function ThemeToggler() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, theme, setTheme } = useTheme();

  // onMount
  useEffect(() => {
    setTheme(resolvedTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return mounted ? (
    <>
      <button
        id="theme-toggler"
        onClick={toggleTheme}
        className="rounded-full outline-none focus:outline-none"
      >
        <span className="sr-only">
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>

        {theme === "dark" ? (
          <SVGlightTheme className="w-6 h-6 text-font-faded dark:text-font-dark-faded hover:text-primary" />
        ) : (
          <SVGdarktTheme className="w-6 h-6 text-font-faded dark:text-font-dark-faded hover:text-primary" />
        )}
      </button>
    </>
  ) : null;
}
