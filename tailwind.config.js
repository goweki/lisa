/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        loader: "loader 0.6s infinite alternate",
      },
      keyframes: {
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
            fillOpacity: 0.25,
            strokeWidth: 1,
            strokeOpacity: 0.5,
            strokeDashoffset: 0,
          },
          "100%": {
            fillOpacity: 1,
            strokeOpacity: 0,
            strokeDashoffset: 0,
          },
        },
        logoRotate: {
          from: { transform: "rotate(90deg)" },
          to: { transform: "rotate(0deg)" },
        },
      },
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
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
