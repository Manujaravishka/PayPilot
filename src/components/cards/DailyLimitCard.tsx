import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { formatCurrency } from "../../utils/formatters";

interface DailyLimitCardProps {
  dailySpendingLimit: number;
  dailyBudget: number;
  weeklyBudget: number;
}

export const DailyLimitCard: React.FC<DailyLimitCardProps> = ({
  dailySpendingLimit,
  dailyBudget,
  weeklyBudget,
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
      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center">
          <Ionicons name="speedometer-outline" size={20} color={Colors.primary} />
        </View>
        <Text className="text-base font-inter-semibold text-textPrimary-light dark:text-textPrimary-dark">
          Daily Budget
        </Text>
      </View>

      <View className="flex-row justify-between">
        <View className="items-center flex-1">
          <Text className="text-xs font-inter-medium text-textSecondary-light dark:text-textSecondary-dark mb-1">
            Daily Limit
          </Text>
          <Text className="text-lg font-inter-bold text-textPrimary-light dark:text-textPrimary-dark">
            {formatCurrency(dailySpendingLimit)}
          </Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-xs font-inter-medium text-textSecondary-light dark:text-textSecondary-dark mb-1">
            Avg/Day
          </Text>
          <Text className="text-lg font-inter-bold text-primary">
            {formatCurrency(dailyBudget)}
          </Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-xs font-inter-medium text-textSecondary-light dark:text-textSecondary-dark mb-1">
            Weekly
          </Text>
          <Text className="text-lg font-inter-bold text-primary">
            {formatCurrency(weeklyBudget)}
          </Text>
        </View>
      </View>
    </View>
  );
};
