import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const applyThemeClass = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () =>
        set((state) => {
          const newValue = !state.isDarkMode;
          applyThemeClass(newValue);
          return { isDarkMode: newValue };
        }),
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => {
        return (state) => {
          // Sync the DOM class immediately when zustand rehydrates from localStorage
          if (state) {
            applyThemeClass(state.isDarkMode);
          }
        };
      },
    },
  ),
);
