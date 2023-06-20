import { create } from "zustand";

interface ThemeState {
  isDarkTheme: boolean;
  setTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkTheme: true,
  setTheme: () => set((state) => ({ isDarkTheme: !state.isDarkTheme })),
}));
