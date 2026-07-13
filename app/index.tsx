import { View, Text, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuth } from "../src/auth/useAuth";
import { Colors } from "../src/theme";

export default function SplashScreen() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: "#0F172A" }}>
        <View className="items-center">
          <View className="w-20 h-20 rounded-3xl" style={{ backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 }} >
            <Text className="text-4xl font-inter-extrabold text-white" style={{ lineHeight: 80, textAlign: "center" }}>P</Text>
          </View>
          <Text className="text-3xl font-inter-extrabold text-white mb-2 mt-6 tracking-tight">
            PayPilot
          </Text>
          <Text className="text-sm font-inter-regular text-[#94A3B8] mb-12">
            Take Control of Every Payday
          </Text>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (isAuthenticated) return <Redirect href="/dashboard" />;

  return <Redirect href="/onboarding" />;
}
