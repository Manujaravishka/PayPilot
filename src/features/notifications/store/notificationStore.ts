import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppNotification, NotificationType } from "../types/notification";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const STORAGE_KEY = "@paypilot_notifications";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoaded: boolean;
}

interface NotificationStore extends NotificationState {
  loadNotifications: () => Promise<void>;
  addNotification: (type: NotificationType, title: string, message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  checkNotifications: (data: {
    todaySpending: number;
    dailyBudget: number;
    totalSpending: number;
    totalIncome: number;
    upcomingBills: { name: string; daysUntilDue: number }[];
    isSalaryDay: boolean;
  }) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoaded: false,

  loadNotifications: async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const notifications = JSON.parse(json) as AppNotification[];
        const unreadCount = notifications.filter((n) => !n.read).length;
        set({ notifications, unreadCount, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  addNotification: (type, title, message) => {
    const notification: AppNotification = {
      id: generateId(),
      type,
      title,
      message,
      read: false,
      createdAt: Date.now(),
    };
    set((state) => {
      const notifications = [notification, ...state.notifications].slice(0, 100);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      return { notifications, unreadCount: state.unreadCount + 1 };
    });
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      return { notifications, unreadCount: Math.max(0, state.unreadCount - 1) };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const notifications = state.notifications.map((n) => ({ ...n, read: true }));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      return { notifications, unreadCount: 0 };
    });
  },

  clearNotifications: () => {
    AsyncStorage.removeItem(STORAGE_KEY);
    set({ notifications: [], unreadCount: 0 });
  },

  checkNotifications: () => {},
}));
