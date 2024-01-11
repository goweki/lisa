import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SVGlightTheme } from "./svgs";

export default function ThemeToggler() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      {theme === "dark" ? (
        <button
          id="theme-toggler"
          onClick={() => setTheme("light")}
          className="rounded-full outline-none focus:outline-none"
        >
          <span className="sr-only">Light Mode</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-6 h-6 hover:text-emerald-400"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </button>
      ) : (
        <button
          id="theme-toggler"
          onClick={() => setTheme("dark")}
          className="rounded-full outline-none focus:outline-none focus-visible:ring focus-visible:ring-gray-100 focus:ring-opacity-20"
        >
          <span className="sr-only">Dark Mode</span>
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="hover:text-emerald-800"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg> */}
          <SVGlightTheme className="w-6 h-6 text-font-faded dark:text-font-dark-faded hover:text-emerald-600 dark:hover:text-emerald-500" />
        </button>
      )}
    </>
  );
}
