import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#faf7f0",
        navy: "#11203b",
        ink: "#0d1a30",
        sand: "#e8e2d4",
        fieldstone: "#efe9dc",
        gold: {
          DEFAULT: "#b08a42",
          dark: "#8a7340",
          light: "#c9a44e",
        },
        "border-warm": "#d8cfb9",
        "border-tan": "#dcd3bf",
        "border-mid": "#c8bfa0",
        cream: "#f1ecdf",
        "text-body": "#2a3142",
        "text-muted": "#3a4254",
        "text-dim": "#5a6172",
        "text-ghost": "#6f7d96",
        "text-footer-muted": "#8a98b3",
        "text-footer-body": "#c3c8d2",
      },
      fontFamily: {
        serif: ['"Times New Roman"', "Times", "serif"],
        mono: ['"Courier New"', "Courier", "monospace"],
        article: ["Georgia", '"Times New Roman"', "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
