import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NotificationSettings } from "../types/notification";
import { DEFAULT_NOTIFICATION_SETTINGS } from "../types/notification";

const SETTINGS_KEY = "@paypilot_notification_settings";

interface NotificationSettingsState {
  settings: NotificationSettings;
  isLoaded: boolean;
}

interface NotificationSettingsStore extends NotificationSettingsState {
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useNotificationSettingsStore = create<NotificationSettingsStore>(
  (set, get) => ({
    settings: DEFAULT_NOTIFICATION_SETTINGS,
    isLoaded: false,

    loadSettings: async () => {
      try {
        const json = await AsyncStorage.getItem(SETTINGS_KEY);
        if (json) {
          const saved = JSON.parse(json) as Partial<NotificationSettings>;
          set({
            settings: { ...DEFAULT_NOTIFICATION_SETTINGS, ...saved },
            isLoaded: true,
          });
        } else {
          set({ isLoaded: true });
        }
      } catch {
        set({ isLoaded: true });
      }
    },

    updateSetting: async (key, value) => {
      const { settings } = get();
      const updated = { ...settings, [key]: value };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      set({ settings: updated });
    },

    resetSettings: async () => {
      await AsyncStorage.removeItem(SETTINGS_KEY);
      set({ settings: DEFAULT_NOTIFICATION_SETTINGS });
    },
  }),
);
