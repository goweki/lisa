/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      // padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-sunken": {
          DEFAULT: "linear-gradient(176deg, #cbd1d8, #f2f8ff)",
          dark: "linear-gradient(176deg, #0e1526, #10192d)",
        },
        "gradient-bulge": {
          DEFAULT: "linear-gradient(176deg, #f2f8ff, #cbd1d8)",
          dark: "linear-gradient(176deg, #10192d, #0e1526)",
        },
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

        //prev
        backg: {
          DEFAULT: "#f1f5f9", //slate.100
          surface: "#e2e8f0", //slate.200
          raised: "#cbd5e1", //slate.300
          dark: {
            DEFAULT: "#020617", //slate.950
            surface: "#0f172a", //slate.900
            raised: "#1e293b", //slate.800
          },
        },
        font: {
          DEFAULT: "#0f172a", //slate.900
          faded: "#1e293b", //slate.800
          inactive: "#475569", //slate.600
          dark: {
            DEFAULT: "#f1f5f9", //slate.100
            faded: "#e2e8f0", //slate.200
            inactive: "#94a3b8", //slate.400
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        loader: {
          to: {
            opacity: 0.1,
            transform: "translate3d(0, -0.5rem, 0)",
          },
        },
        fadein: {
          "0%": { opacity: 0 }, //from: { opacity: 0 }
          "100%": { opacity: 1 }, //to: { opacity: 1 }
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
      //prev
      boxShadow: {
        DEFAULT: "6px 6px 12px #cbd1d8,-6px -6px 12px #f9ffff",
        pressed: "inset 6px 6px 12px #cbd1d8,inset -6px -6px 12px #f9ffff",
        dak: "8px 8px 16px #090d18,-8px -8px 16px #15213c",
        dpressed: "inset 8px 8px 16px #090d18,inset -8px -8px 16px #15213c",
        // dak: {
        //   DEFAULT: "8px 8px 16px #090d18,-8px -8px 16px #15213c",
        //   pressed: "inset 8px 8px 16px #090d18,inset -8px -8px 16px #15213c",
        // },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
    require("autoprefixer"),
  ],
};
