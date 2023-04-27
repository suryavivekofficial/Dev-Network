import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      // even numbered accent for dark mode and vice-versa
      black: "#000",
      "accent-1": "#111",
      "accent-2": "#333",
      "accent-3": "#444",
      "accent-4": "#666",
      "accent-5": "#888",
      "accent-6": "#999",
      "accent-7": "#eaeaea",
      "accent-8": "#fafafa",
      white: "#fff",
    },
  },
  plugins: [],
} satisfies Config;
