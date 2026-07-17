import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "@paypilot_theme";

interface ThemeState {
  isDark: boolean;
  isLoaded: boolean;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  setTheme: (dark: boolean) => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,
  isLoaded: false,

  loadTheme: async () => {
    try {
      const val = await AsyncStorage.getItem(THEME_KEY);
      set({ isDark: val === "dark", isLoaded: true });
    } catch {
      set({ isLoaded: true });
    }
  },

  toggleTheme: async () => {
    const next = !get().isDark;
    await AsyncStorage.setItem(THEME_KEY, next ? "dark" : "light");
    set({ isDark: next });
  },

  setTheme: async (dark: boolean) => {
    await AsyncStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    set({ isDark: dark });
  },
}));
