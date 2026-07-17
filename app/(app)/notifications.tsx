import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useNotificationStore } from "../../src/features/notifications/store/notificationStore";
import { Colors } from "../../src/theme";
import { formatShortDate } from "../../src/utils/formatters";
import { useThemeStore } from "../../src/features/theme/store/themeStore";
import { themeColor } from "../../src/features/theme/utils";

const NOTIFICATION_ICONS: Record<string, { icon: string; color: string }> = {
  expense_reminder: { icon: "card-outline", color: Colors.info },
  salary_day: { icon: "cash-outline", color: Colors.success },
  monthly_summary: { icon: "bar-chart-outline", color: Colors.primary },
  savings_goal: { icon: "flag-outline", color: Colors.secondary },
  budget_warning: { icon: "warning-outline", color: Colors.warning },
  overspend: { icon: "warning-outline", color: Colors.error },
  budget_80: { icon: "alert-circle-outline", color: Colors.warning },
  budget_100: { icon: "alert-circle-outline", color: Colors.error },
  idle_3_days: { icon: "time-outline", color: Colors.info },
  goal_reached: { icon: "trophy-outline", color: Colors.success },
  bill_reminder: { icon: "document-text-outline", color: Colors.warning },
  info: { icon: "information-circle-outline", color: Colors.info },
};

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    isLoaded,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotificationStore();

  useEffect(() => {
    if (!isLoaded) loadNotifications();
  }, []);

  const isDark = useThemeStore((s) => s.isDark);
  const c = (color: any) => themeColor(color, isDark);

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    Alert.alert("Clear All", "Delete all notifications?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: clearNotifications },
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteNotification(id) },
    ]);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: c(Colors.background) }}>
      <LinearGradient
        colors={Colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-16 pb-6"
      >
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-2xl items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <Text className="text-xl font-inter-bold text-white">
              Notifications
            </Text>
          </View>
          {notifications.length > 0 && (
            <View className="flex-row gap-2">
              {unreadCount > 0 && (
                <TouchableOpacity
                  onPress={markAllAsRead}
                  className="px-3 py-2 rounded-xl"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  <Text className="text-xs font-inter-semibold text-white">
                    Mark Read
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={handleClearAll}
                className="px-3 py-2 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              >
                <Text className="text-xs font-inter-semibold text-white">
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Text className="text-sm font-inter-medium text-white/70">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </Text>
        )}
      </LinearGradient>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {!isLoaded && (
          <View className="items-center py-20">
            <Text className="text-base font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
              Loading notifications...
            </Text>
          </View>
        )}

        {isLoaded && notifications.length === 0 && (
          <View className="items-center py-20">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}
            >
              <Ionicons name="notifications-off-outline" size={36} color={Colors.primary} />
            </View>
            <Text
              className="text-xl font-inter-bold text-center mb-2"
              style={{ color: c(Colors.textPrimary) }}
            >
              No Notifications
            </Text>
            <Text className="text-sm font-inter-regular text-center px-8" style={{ color: c(Colors.textSecondary) }}>
              You're all caught up! Notifications will appear here when there's activity.
            </Text>
          </View>
        )}

        {isLoaded && notifications.length > 0 && (
          <View className="py-4">
            {notifications.map((n) => {
              const meta = NOTIFICATION_ICONS[n.type] || NOTIFICATION_ICONS.info;
              return (
                <TouchableOpacity
                  key={n.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (!n.read) markAsRead(n.id);
                  }}
                  onLongPress={() => handleDelete(n.id)}
                  className="rounded-2xl p-4 mb-2 flex-row items-start"
                  style={{
                    backgroundColor: n.read ? c(Colors.surface) : c(Colors.surface),
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.03,
                    shadowRadius: 4,
                    elevation: 1,
                    borderWidth: 1,
                    borderColor: n.read ? c(Colors.border) : isDark ? "rgba(0, 166, 81, 0.3)" : "rgba(0, 166, 81, 0.15)",
                  }}
                >
                  <View
                    className="w-10 h-10 rounded-2xl items-center justify-center mr-3 mt-0.5"
                    style={{ backgroundColor: `${meta.color}15` }}
                  >
                    <Ionicons name={meta.icon as any} size={20} color={meta.color} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      {!n.read && (
                        <View
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: Colors.primary }}
                        />
                      )}
                      <Text
                        className={`text-sm flex-1 ${
                          n.read ? "font-inter-medium" : "font-inter-semibold"
                        }`}
                        style={{ color: c(Colors.textPrimary) }}
                      >
                        {n.title}
                      </Text>
                    </View>
                    <Text className="text-xs font-inter-regular mb-1" style={{ color: c(Colors.textSecondary) }}>
                      {n.message}
                    </Text>
                    <Text className="text-[10px] font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                      {formatShortDate(n.createdAt)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(n.id)}
                    className="ml-2 p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-outline" size={16} color={c(Colors.textSecondary)} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
            <View className="h-8" />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
