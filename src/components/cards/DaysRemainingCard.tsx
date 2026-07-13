import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";

interface DaysRemainingCardProps {
  daysRemaining: number;
  daysIntoCycle: number;
}

export const DaysRemainingCard: React.FC<DaysRemainingCardProps> = ({
  daysRemaining,
  daysIntoCycle,
}) => {
  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-3xl p-5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center">
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text className="text-sm font-inter-medium text-textSecondary-light dark:text-textSecondary-dark">
              Days Until Next Salary
            </Text>
            <Text className="text-3xl font-inter-extrabold text-textPrimary-light dark:text-textPrimary-dark mt-1">
              {daysRemaining}
            </Text>
          </View>
        </View>
        <View className="items-end bg-background-light dark:bg-background-dark rounded-2xl px-4 py-3">
          <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
            Day
          </Text>
          <Text className="text-2xl font-inter-bold text-primary mt-0.5">
            {daysIntoCycle}
          </Text>
        </View>
      </View>
    </View>
  );
};
