/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-hover": "linear-gradient(145deg, #ffffff, #d9dde0)",
        "gradient-pressed": "linear-gradient(145deg, #d9dde0, #ffffff)",
        dark: {
          "gradient-hover": "linear-gradient(145deg,  #10192d, #0e1526)",
          "gradient-pressed": "linear-gradient(145deg, #0e1526, #10192d)",
        },
      },
      colors: {
        background: {
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
      boxShadow: {
        DEFAULT: "box-shadow: 6px 6px 12px #bec2c5, -6px -6px 12px #ffffff",
        dark: "6px 6px 9px #080c16, -6px -6px 9px #16223e",
      },
    },
  },
  plugins: [],
};
