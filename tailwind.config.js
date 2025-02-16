/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-sunken":
          "linear-gradient(176deg, theme('colors.slate.300'), theme('colors.slate.100'))",
        "gradient-sunken-dark":
          "linear-gradient(176deg, theme('colors.slate.900'), theme('colors.slate.800'))",
        "gradient-bulge":
          "linear-gradient(176deg, theme('colors.slate.100'), theme('colors.slate.300'))",
        "gradient-bulge-dark":
          "linear-gradient(176deg, theme('colors.slate.800'), theme('colors.slate.900'))",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        loader: {
          to: {
            opacity: 0.1,
            transform: "translate3d(0, -0.5rem, 0)",
          },
        },
        fadein: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        doodle: {
          "90%": {
            fillOpacity: 0.5,
            strokeWidth: 1,
            strokeOpacity: 0.25,
            strokeDashoffset: 500,
          },
          "100%": {
            fillOpacity: 1,
            strokeOpacity: 0,
            strokeDashoffset: 0,
          },
        },
        typing: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        light: "2px 2px 4px #cbd1d8, -2px -2px 4px #f9ffff",
        pressed: "inset 3px 3px 6px #cbd1d8, inset -3px -3px 6px #f9ffff",
        dark: "2px 2px 4px #065f46, -2px -2px 4px #022c22",
        dpressed: "inset 4px 4px 8px #065f46, inset -4px -4px 8px #064e3b",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require("autoprefixer"),
  ],
};
