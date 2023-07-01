import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ThemeState {
  isDarkTheme: boolean;
  setTheme: () => void;
}

export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      isDarkTheme: true,
      setTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
