import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AppNotification, NotificationType } from "../types/notification";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const STORAGE_KEY = "@paypilot_notifications";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoaded: boolean;
}

interface NotificationStore extends NotificationState {
  loadNotifications: () => Promise<void>;
  addNotification: (
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearNotifications: () => void;
  hasNotificationType: (type: NotificationType) => boolean;
}

async function persistNotifications(notifications: AppNotification[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, 200)));
  } catch {
    // Silently fail - in-memory state still works
  }
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

  addNotification: (type, title, message, data) => {
    const { notifications } = get();

    const duplicate = notifications.some(
      (n) =>
        n.type === type &&
        n.message === message &&
        Date.now() - n.createdAt < 86400000,
    );
    if (duplicate) return;

    const notification: AppNotification = {
      id: generateId(),
      type,
      title,
      message,
      read: false,
      createdAt: Date.now(),
      data,
    };

    const updated = [notification, ...notifications].slice(0, 200);
    set({
      notifications: updated,
      unreadCount: get().unreadCount + 1,
    });
    persistNotifications(updated);
  },

  markAsRead: (id) => {
    const { notifications } = get();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    set({
      notifications: updated,
      unreadCount: Math.max(0, get().unreadCount - 1),
    });
    persistNotifications(updated);
  },

  markAllAsRead: () => {
    const { notifications } = get();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
    persistNotifications(updated);
  },

  deleteNotification: (id) => {
    const { notifications } = get();
    const target = notifications.find((n) => n.id === id);
    const updated = notifications.filter((n) => n.id !== id);
    set({
      notifications: updated,
      unreadCount: target && !target.read
        ? Math.max(0, get().unreadCount - 1)
        : get().unreadCount,
    });
    persistNotifications(updated);
  },

  clearNotifications: () => {
    AsyncStorage.removeItem(STORAGE_KEY);
    set({ notifications: [], unreadCount: 0 });
  },

  hasNotificationType: (type) => {
    return get().notifications.some((n) => n.type === type);
  },
}));
