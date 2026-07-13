import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { formatCurrency } from "../../utils/formatters";

interface SalaryCardProps {
  salary: number;
  remainingMoney: number;
  spendingProgress: number;
}

export const SalaryCard: React.FC<SalaryCardProps> = ({
  salary,
  remainingMoney,
  spendingProgress,
}) => {
  const progressColor =
    spendingProgress > 80
      ? Colors.error
      : spendingProgress > 60
      ? Colors.warning
      : Colors.success;

  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-inter-medium text-textSecondary-light dark:text-textSecondary-dark">
          Monthly Salary
        </Text>
        <View className="bg-primary/10 rounded-full px-3.5 py-1.5">
          <Text className="text-xs font-inter-semibold text-primary">
            Active
          </Text>
        </View>
      </View>

      <Text className="text-4xl font-inter-extrabold text-textPrimary-light dark:text-textPrimary-dark mb-4 tracking-tight">
        {formatCurrency(salary)}
      </Text>

      <View className="flex-row justify-between mb-4">
        <View>
          <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
            Remaining
          </Text>
          <Text className="text-xl font-inter-bold text-success">
            {formatCurrency(remainingMoney)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
            Spent
          </Text>
          <Text className="text-xl font-inter-bold text-textPrimary-light dark:text-textPrimary-dark">
            {formatCurrency(salary - remainingMoney)}
          </Text>
        </View>
      </View>

      <View className="h-3 bg-background-light dark:bg-background-dark rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(spendingProgress, 100)}%`,
            backgroundColor: progressColor,
          }}
        />
      </View>
    </View>
  );
};
