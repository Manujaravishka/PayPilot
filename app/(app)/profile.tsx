import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking, Switch, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../src/auth/useAuth";
import { useAuthStore } from "../../src/features/auth/store/authStore";
import { useSalaryStore } from "../../src/features/salary/store/salaryStore";
import { useNotificationStore } from "../../src/features/notifications/store/notificationStore";
import { useNotificationSettingsStore } from "../../src/features/notifications/store/notificationSettingsStore";
import { useThemeStore } from "../../src/features/theme/store/themeStore";
import { themeColor } from "../../src/features/theme/utils";
import { auth } from "../../src/services/firebase";
import { signOut } from "firebase/auth";
import { useTransactionStore } from "../../src/features/transactions/store/transactionStore";
import { useGoalStore } from "../../src/features/goals/store/goalStore";
import { Colors } from "../../src/theme";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { currentSalary, salaryHistory, fetchSalaryHistory } = useSalaryStore();
  const { notifications, unreadCount, loadNotifications } = useNotificationStore();
  const { settings, updateSetting, loadSettings, isLoaded } = useNotificationSettingsStore();
  const resetTransactions = useTransactionStore((s) => s.reset);
  const resetGoals = useGoalStore((s) => s.reset);
  const resetSalary = useSalaryStore((s) => s.reset);
  const clearNotifications = useNotificationStore((s) => s.clearNotifications);
  const setUser = useAuthStore((s) => s.setUser);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [loggingOut, setLoggingOut] = useState(false);
  const c = (color: any) => themeColor(color, isDark);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchSalaryHistory(user.uid).catch(() => {});
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        fetchSalaryHistory(user.uid).catch(() => {});
      }
    }, [user?.uid]),
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          try {
            if (auth) {
              await signOut(auth);
            }
            try {
              await logout();
            } catch {
            }
            setUser(null);
            resetTransactions();
            resetGoals();
            resetSalary();
            clearNotifications();
            router.replace("/login");
          } catch (error: any) {
            Alert.alert("Logout Error", error?.message || "Could not sign out. Please try again.");
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const handlePrivacy = () => {
    Alert.alert(
      "Privacy",
      "Your data is stored securely in Firebase Firestore with encrypted transmission. We do not share your personal financial data with third parties.",
    );
  };

  const handleHelp = () => {
    Alert.alert(
      "Help & FAQ",
      "PayPilot is your personal finance manager.\n\n" +
      "• Set your monthly salary and track savings\n" +
      "• Track daily spending across 10 categories\n" +
      "• View your daily safe spending limit\n" +
      "• Create savings goals and track progress\n" +
      "• Monthly records are automatically saved\n\n" +
      "For more help, contact: support@paypilot.app",
    );
  };

  const handleFeedback = () => {
    Linking.openURL("mailto:support@paypilot.app?subject=PayPilot Feedback").catch(() => {
      Alert.alert("Send Feedback", "Email us at: support@paypilot.app");
    });
  };

  const handleRateApp = () => {
    Alert.alert(
      "Rate PayPilot",
      "If you enjoy using PayPilot, please take a moment to rate the app!",
      [
        { text: "Rate Now", onPress: () => {
          Linking.openURL("https://play.google.com/store/apps/details?id=com.paypilot.app").catch(() => {
            Alert.alert("Rate Us", "Thank you for your support!");
          });
        }},
        { text: "Later", style: "cancel" },
      ],
    );
  };

  const toggleSetting = async (key: string, value: boolean) => {
    await updateSetting(key as any, value);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: c(Colors.background) }}>
      {loggingOut && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isDark ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)",
            zIndex: 100,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text className="text-base font-inter-medium mt-4" style={{ color: c(Colors.textPrimary) }}>
            Signing out...
          </Text>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={Colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-6 pt-16 pb-8 items-center">
          <View
            className="w-22 h-22 rounded-full items-center justify-center mb-4"
            style={{
              width: 88,
              height: 88,
              borderRadius: 44,
              backgroundColor: "rgba(255,255,255,0.15)",
              borderWidth: 3,
              borderColor: "rgba(255,255,255,0.3)",
            }}
          >
            <Text className="text-4xl font-inter-bold text-white">
              {user?.displayName?.[0] || "U"}
            </Text>
          </View>
          <Text className="text-2xl font-inter-bold text-white mb-1">
            {user?.displayName || "User"}
          </Text>
          <Text className="text-sm font-inter-regular text-white/60">
            {user?.email || ""}
          </Text>
        </LinearGradient>

        <View className="px-4 -mt-4">
          {/* Salary Summary */}
          <View
            className="rounded-3xl p-5 mb-6"
            style={{
              backgroundColor: c(Colors.surface),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                  <Ionicons name="cash-outline" size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text className="text-base font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>
                    Current Salary
                  </Text>
                  <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                    {salaryHistory.length > 0
                      ? `Last updated ${new Date(salaryHistory[0].effectiveDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                      : "Not set yet"}
                  </Text>
                </View>
              </View>
              <Text className="text-xl font-inter-bold" style={{ color: Colors.primary }}>
                Rs. {currentSalary.toLocaleString()}
              </Text>
            </View>
            {salaryHistory.length > 0 && (
              <View className="rounded-2xl p-3" style={{ backgroundColor: c(Colors.background) }}>
                <Text className="text-xs font-inter-semibold mb-2" style={{ color: c(Colors.textSecondary) }}>Salary History</Text>
                {salaryHistory.map((rec) => (
                  <View key={rec.id} className="flex-row justify-between py-1.5" style={{ borderBottomWidth: 1, borderColor: c(Colors.border) }}>
                    <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                      {new Date(rec.effectiveDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </Text>
                    <Text className="text-xs font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>
                      Rs. {rec.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Notification Settings */}
          <View className="mb-6">
            <Text className="text-sm font-inter-semibold uppercase tracking-wider mb-3 px-1" style={{ color: c(Colors.textSecondary) }}>
              Notification Settings
            </Text>
            <View
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: c(Colors.surface),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {[
                { key: "salaryReminders", icon: "cash-outline", label: "Salary Reminders", color: Colors.success, desc: "Remind on salary day" },
                { key: "expenseReminders", icon: "card-outline", label: "Expense Reminders", color: Colors.info, desc: "Daily expense reminder" },
                { key: "monthlySummary", icon: "bar-chart-outline", label: "Monthly Summary", color: Colors.primary, desc: "Summary at month end" },
                { key: "savingsReminders", icon: "flag-outline", label: "Savings Reminders", color: Colors.secondary, desc: "Weekly savings check" },
                { key: "budgetAlerts", icon: "warning-outline", label: "Budget Alerts", color: Colors.warning, desc: "Warn when overspending" },
              ].map((item, index, arr) => (
                <View
                  key={item.key}
                  className="flex-row items-center justify-between px-5 py-3.5"
                  style={{ borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderColor: c(Colors.border) }}
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: `${item.color}12` }}>
                      <Ionicons name={item.icon as any} size={18} color={item.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-inter-medium" style={{ color: c(Colors.textPrimary) }}>
                        {item.label}
                      </Text>
                      <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={settings[item.key as keyof typeof settings] as boolean}
                    onValueChange={(v) => toggleSetting(item.key, v)}
                    trackColor={{ false: c(Colors.border), true: `${Colors.primary}60` }}
                    thumbColor={
                      (settings[item.key as keyof typeof settings] as boolean)
                        ? Colors.primary
                        : c(Colors.border)
                    }
                  />
                </View>
              ))}
            </View>
          </View>

          {/* General Settings */}
          <View className="mb-6">
            <Text className="text-sm font-inter-semibold uppercase tracking-wider mb-3 px-1" style={{ color: c(Colors.textSecondary) }}>
              Settings
            </Text>
            <View
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: c(Colors.surface),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View className="flex-row items-center justify-between px-5 py-3.5" style={{ borderBottomWidth: 1, borderColor: c(Colors.border) }}>
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: `${Colors.info}12` }}>
                    <Ionicons name="moon-outline" size={18} color={Colors.info} />
                  </View>
                  <Text className="text-base font-inter-medium" style={{ color: c(Colors.textPrimary) }}>
                    Dark Mode
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={(v) => {
                    toggleTheme();
                    Alert.alert("Dark Mode", v ? "Dark mode enabled" : "Light mode enabled");
                  }}
                  trackColor={{ false: c(Colors.border), true: `${Colors.primary}60` }}
                  thumbColor={isDark ? Colors.primary : c(Colors.border)}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (notifications.length === 0) {
                    Alert.alert("Notifications", "No notifications yet.");
                  } else {
                    Alert.alert(
                      "Notifications",
                      `${unreadCount} unread of ${notifications.length} total`,
                      [
                        { text: "View All", onPress: () => router.push("/notifications") },
                        { text: "Close", style: "cancel" },
                      ],
                    );
                  }
                }}
                className="flex-row items-center justify-between px-5 py-3.5"
                style={{ borderBottomWidth: 1, borderColor: c(Colors.border) }}
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: `${Colors.warning}12` }}>
                    <Ionicons name="notifications-outline" size={18} color={Colors.warning} />
                  </View>
                  <View>
                    <Text className="text-base font-inter-medium" style={{ color: c(Colors.textPrimary) }}>
                      Notifications
                    </Text>
                    {unreadCount > 0 && (
                      <Text className="text-xs font-inter-regular text-error">
                        {unreadCount} unread
                      </Text>
                    )}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={c(Colors.textSecondary)} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePrivacy}
                className="flex-row items-center justify-between px-5 py-3.5"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: `${Colors.secondary}12` }}>
                    <Ionicons name="shield-outline" size={18} color={Colors.secondary} />
                  </View>
                  <Text className="text-base font-inter-medium" style={{ color: c(Colors.textPrimary) }}>
                    Privacy
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={c(Colors.textSecondary)} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Support */}
          <View className="mb-6">
            <Text className="text-sm font-inter-semibold uppercase tracking-wider mb-3 px-1" style={{ color: c(Colors.textSecondary) }}>
              Support
            </Text>
            <View
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: c(Colors.surface),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {[
                { icon: "help-circle-outline", label: "Help & FAQ", color: Colors.primary, action: handleHelp },
                { icon: "chatbubble-ellipses-outline", label: "Send Feedback", color: Colors.success, action: handleFeedback },
                { icon: "star-outline", label: "Rate the App", color: Colors.warning, action: handleRateApp },
              ].map((item, index, arr) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={item.action}
                  className="flex-row items-center justify-between px-5 py-4"
                  style={{ borderBottomWidth: index < arr.length - 1 ? 1 : 0, borderColor: c(Colors.border) }}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: `${item.color}12` }}>
                      <Ionicons name={item.icon as any} size={18} color={item.color} />
                    </View>
                    <Text className="text-base font-inter-medium" style={{ color: c(Colors.textPrimary) }}>
                      {item.label}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={c(Colors.textSecondary)} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* About */}
          <View
            className="rounded-3xl p-5 mb-6"
            style={{
              backgroundColor: c(Colors.surface),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                <Ionicons name="information-outline" size={18} color={Colors.primary} />
              </View>
              <View>
                <Text className="text-base font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>
                  About PayPilot
                </Text>
                <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                  Version 1.0.0
                </Text>
              </View>
            </View>
            <Text className="text-sm font-inter-regular leading-5" style={{ color: c(Colors.textSecondary) }}>
              Your personal salary manager. Track income, manage expenses, set savings goals, and stay in control of your finances.
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            disabled={loggingOut}
            className="rounded-2xl p-4 mb-8 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: c(Colors.surface),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
              opacity: loggingOut ? 0.5 : 1,
            }}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text className="text-base font-inter-semibold text-error">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
