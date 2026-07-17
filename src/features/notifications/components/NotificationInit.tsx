import { useEffect } from "react";
import { useAuthStore } from "../../../features/auth/store/authStore";
import { useNotificationStore } from "../store/notificationStore";
import { useNotificationSettingsStore } from "../store/notificationSettingsStore";
import { notificationService } from "../services/notificationService";
import { useNotificationInit } from "../hooks/useNotificationInit";

export function NotificationInit() {
  const user = useAuthStore((s) => s.user);
  const loadNotifications = useNotificationStore((s) => s.loadNotifications);
  const loadSettings = useNotificationSettingsStore((s) => s.loadSettings);
  const settings = useNotificationSettingsStore((s) => s.settings);
  const isLoaded = useNotificationSettingsStore((s) => s.isLoaded);

  useNotificationInit(user?.uid);

  useEffect(() => {
    loadNotifications();
    loadSettings();
  }, []);

  useEffect(() => {
    if (!user?.uid || !isLoaded) return;
    if (settings.expenseReminders) {
      notificationService.scheduleExpenseReminder();
    }
    if (settings.salaryReminders) {
      notificationService.scheduleSalaryReminder(settings.salaryDay);
    }
    if (settings.monthlySummary) {
      notificationService.scheduleMonthlySummary();
    }
    if (settings.savingsReminders) {
      notificationService.scheduleSavingsGoalReminder();
    }
  }, [user?.uid, isLoaded, settings.expenseReminders, settings.salaryReminders, settings.monthlySummary, settings.savingsReminders]);

  return null;
}
