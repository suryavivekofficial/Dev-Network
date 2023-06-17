import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkTheme: boolean;
  setTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkTheme: true,
      setTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
    }),
    {
      name: "theme",
    }
  )
);
