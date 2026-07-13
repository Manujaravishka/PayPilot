import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../src/auth/useAuth";
import { useAuthStore } from "../../src/features/auth/store/authStore";
import { useNotificationStore } from "../../src/features/notifications/store/notificationStore";
import { Colors } from "../../src/theme";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const user = useAuthStore((s) => s.user);
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotificationStore();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const handleNotifications = () => {
    const nCount = notifications.length;
    if (nCount === 0) {
      Alert.alert("Notifications", "No notifications yet.");
      return;
    }
    Alert.alert(
      "Notifications",
      `${unreadCount} unread of ${nCount} total notifications`,
      [
        { text: "Mark All Read", onPress: markAllAsRead },
        { text: "Clear All", onPress: clearNotifications, style: "destructive" },
        { text: "Close", style: "cancel" },
      ],
    );
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
      "• Add your income from various sources\n" +
      "• Track daily spending across 10 categories\n" +
      "• View your daily safe spending limit\n" +
      "• Create savings goals and track progress\n" +
      "• Get AI-powered spending insights\n\n" +
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

  const menuItems = [
    {
      section: "Settings",
      items: [
        { icon: "moon-outline", label: "Dark Mode", color: Colors.info, action: () => {
          setDarkMode(!darkMode);
          Alert.alert("Dark Mode", darkMode ? "Light mode enabled" : "Dark mode enabled");
        }},
        { icon: "notifications-outline", label: "Notifications", color: Colors.warning, action: handleNotifications },
        { icon: "shield-outline", label: "Privacy", color: Colors.secondary, action: handlePrivacy },
      ],
    },
    {
      section: "Support",
      items: [
        { icon: "help-circle-outline", label: "Help & FAQ", color: Colors.primary, action: handleHelp },
        { icon: "chatbubble-ellipses-outline", label: "Send Feedback", color: Colors.success, action: handleFeedback },
        { icon: "star-outline", label: "Rate the App", color: Colors.warning, action: handleRateApp },
      ],
    },
  ];

  return (
    <View className="flex-1" style={{ backgroundColor: "#F8FAFC" }}>
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
          {/* Menu Sections */}
          {menuItems.map((section) => (
            <View key={section.section} className="mb-6">
              <Text className="text-sm font-inter-semibold text-textSecondary-light uppercase tracking-wider mb-3 px-1">
                {section.section}
              </Text>
              <View
                className="rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: "#FFFFFF",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                {section.items.map((item, index) => (
                  <TouchableOpacity
                    key={item.label}
                    onPress={item.action}
                    className="flex-row items-center justify-between px-5 py-4"
                    style={{ borderBottomWidth: index < section.items.length - 1 ? 1 : 0, borderColor: "#F1F5F9" }}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-9 h-9 rounded-2xl items-center justify-center" style={{ backgroundColor: `${item.color}12` }}>
                        <Ionicons name={item.icon as any} size={18} color={item.color} />
                      </View>
                      <Text className="text-base font-inter-medium" style={{ color: "#111827" }}>
                        {item.label}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* About */}
          <View
            className="rounded-3xl p-5 mb-6"
            style={{
              backgroundColor: "#FFFFFF",
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
                <Text className="text-base font-inter-semibold" style={{ color: "#111827" }}>
                  About PayPilot
                </Text>
                <Text className="text-xs font-inter-regular text-textSecondary-light">
                  Version 1.0.0
                </Text>
              </View>
            </View>
            <Text className="text-sm font-inter-regular text-textSecondary-light leading-5">
              Your personal finance manager. Track income, manage expenses, set savings goals, and stay in control of your finances.
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            className="rounded-2xl p-4 mb-8 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 8,
              elevation: 2,
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
