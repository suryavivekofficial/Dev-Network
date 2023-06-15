import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  theme: "dark" | "light";
  setTheme: () => void;
}

export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      theme: "dark",
      setTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
    }),
    {
      name: "theme",
    }
  )
);
