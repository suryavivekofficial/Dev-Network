import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%);" },
          "100%": { transform: "translateX(0%);" },
        },
      },
      animation: {
        "slide-in": "slide-in 800ms ease-in-out forwards normal",
      },
    },
    colors: {
      // even numbered accent for dark mode and vice-versa
      transparent: "transparent",
      current: "currentColor",
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
      "blue-1": "#d3e5ff",
      "blue-2": "#3291ff",
      "blue-3": "#0070f3",
      "blue-4": "#0761d1",
      "red-1": "#f7d4d6",
      "red-2": "#f38ba8",
      "red-3": "#f33",
      "red-4": "#e60000",
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
