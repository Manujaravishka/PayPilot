import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { authConfig } from "../../../auth/config";
import type { NotificationType } from "../types/notification";

const SCHEDULED_IDS_KEY = "@paypilot_scheduled_notification_ids";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === "web") return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  },

  async getExpoPushToken(): Promise<string | null> {
    try {
      if (Platform.OS === "web") return null;
      const granted = await this.requestPermissions();
      if (!granted) return null;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      });
      return tokenData.data;
    } catch {
      return null;
    }
  },

  async saveFcmToken(userId: string, token: string): Promise<void> {
    if (!db || authConfig.isDemoMode) return;
    try {
      await setDoc(
        doc(db, "users", userId, "deviceTokens", token),
        {
          token,
          platform: Platform.OS,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      );
    } catch {
      // Silently fail - FCM token storage is non-critical
    }
  },

  async scheduleExpenseReminder(): Promise<void> {
    if (Platform.OS === "web") return;
    const existingId = await this.getScheduledId("expense_reminder");
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Record Your Expenses",
        body: "Don't forget to log today's expenses to stay on track with your budget.",
        data: { type: "expense_reminder" },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20,
        minute: 0,
      },
    });
    await this.saveScheduledId("expense_reminder", id);
  },

  async scheduleSalaryReminder(salaryDay: number): Promise<void> {
    if (Platform.OS === "web") return;
    const existingId = await this.getScheduledId("salary_day");
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }
    const day = Math.min(salaryDay, 28);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Salary Day!",
        body: "Your salary should be credited today. Log it to keep your finances updated.",
        data: { type: "salary_day" },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day,
        hour: 9,
        minute: 0,
      },
    });
    await this.saveScheduledId("salary_day", id);
  },

  async scheduleMonthlySummary(): Promise<void> {
    if (Platform.OS === "web") return;
    const existingId = await this.getScheduledId("monthly_summary");
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Monthly Summary Ready",
        body: "Check your spending and savings summary for last month.",
        data: { type: "monthly_summary" },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: 1,
        hour: 10,
        minute: 0,
      },
    });
    await this.saveScheduledId("monthly_summary", id);
  },

  async scheduleSavingsGoalReminder(): Promise<void> {
    if (Platform.OS === "web") return;
    const existingId = await this.getScheduledId("savings_goal");
    if (existingId) {
      await Notifications.cancelScheduledNotificationAsync(existingId);
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weekly Savings Check",
        body: "Review your savings goals and add money if possible.",
        data: { type: "savings_goal" },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 1,
        hour: 10,
        minute: 0,
      },
    });
    await this.saveScheduledId("savings_goal", id);
  },

  async cancelAllScheduled(): Promise<void> {
    if (Platform.OS === "web") return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await AsyncStorage.removeItem(SCHEDULED_IDS_KEY);
  },

  async getScheduledId(key: string): Promise<string | null> {
    try {
      const json = await AsyncStorage.getItem(SCHEDULED_IDS_KEY);
      if (json) {
        const ids = JSON.parse(json) as Record<string, string>;
        return ids[key] || null;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveScheduledId(key: string, id: string): Promise<void> {
    try {
      const json = await AsyncStorage.getItem(SCHEDULED_IDS_KEY);
      const ids = json ? JSON.parse(json) as Record<string, string> : {};
      ids[key] = id;
      await AsyncStorage.setItem(SCHEDULED_IDS_KEY, JSON.stringify(ids));
    } catch {
      // Silently fail
    }
  },

  async triggerLocalNotification(
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<void> {
    if (Platform.OS === "web") return;
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type, ...data },
        sound: true,
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 1,
      },
    });
  },
};
