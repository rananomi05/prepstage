import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stage: {
          DEFAULT: "#0d0d12",
          soft: "#17171f",
          line: "rgba(247,243,234,0.1)",
        },
        card: "#f2ede1",
        spotlight: {
          DEFAULT: "#ffb703",
          hover: "#ffc531",
          soft: "rgba(255,183,3,0.12)",
        },
        cue: {
          DEFAULT: "#2ec4b6",
          soft: "rgba(46,196,182,0.14)",
        },
        flag: {
          DEFAULT: "#ef5b5b",
          soft: "rgba(239,91,91,0.14)",
        },
        encore: {
          DEFAULT: "#b892ff",
          soft: "rgba(184,146,255,0.14)",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
