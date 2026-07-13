import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

interface SavingsCardProps {
  savings: number;
  salary: number;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({ savings, salary }) => {
  const rate = salary > 0 ? (savings / salary) * 100 : 0;

  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="w-10 h-10 rounded-2xl bg-success/10 items-center justify-center mb-3">
        <Ionicons name="save-outline" size={20} color={Colors.success} />
      </View>
      <Text className="text-xs font-inter-medium text-textSecondary-light dark:text-textSecondary-dark mb-1">
        Savings
      </Text>
      <Text className="text-2xl font-inter-extrabold text-success mb-1">
        {formatCurrency(savings)}
      </Text>
      <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
        {formatPercentage(rate, 1)} of income
      </Text>
    </View>
  );
};
