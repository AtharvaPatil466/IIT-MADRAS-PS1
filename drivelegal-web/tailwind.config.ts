import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1f1d1a",
          muted: "#605d57",
          faint: "#9b968d",
        },
        paper: "#faf9f6",
        line: "#e8e4dc",
        accent: {
          DEFAULT: "#c25c2a",
          soft: "#f3e6dc",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Inter", "sans-serif"],
        serif: ["ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
