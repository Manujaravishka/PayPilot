import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { Redirect, Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/auth/useAuth";
import { useNotificationStore } from "../../src/features/notifications/store/notificationStore";
import { useNotificationSettingsStore } from "../../src/features/notifications/store/notificationSettingsStore";
import { useThemeStore } from "../../src/features/theme/store/themeStore";
import { themeColor } from "../../src/features/theme/utils";
import { Colors } from "../../src/theme";
import { useEffect } from "react";

export default function AppLayout() {
  const { isLoading, isAuthenticated } = useAuth();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const isDark = useThemeStore((s) => s.isDark);
  const loadTheme = useThemeStore((s) => s.loadTheme);
  const loadSettings = useNotificationSettingsStore((s) => s.loadSettings);
  const c = (color: any) => themeColor(color, isDark);

  useEffect(() => {
    loadTheme();
    loadSettings();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: isDark ? Colors.backgroundDark : Colors.backgroundLight }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: c(Colors.textSecondary),
        tabBarStyle: {
          backgroundColor: isDark ? Colors.surfaceDark : Colors.surfaceLight,
          borderTopColor: isDark ? Colors.borderDark : Colors.borderLight,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 28,
          height: 84,
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/add")}
              style={{
                top: -18,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: Colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: Colors.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  elevation: 8,
                }}
              >
                <Ionicons name="add" size={30} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="notifications-outline" size={size} color={color} />
              {unreadCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -8,
                    backgroundColor: Colors.error,
                    borderRadius: 10,
                    minWidth: 18,
                    height: 18,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontSize: 10,
                      fontFamily: "Inter_700Bold",
                    }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
