import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

interface ExpensesCardProps {
  totalExpenses: number;
  salary: number;
}

export const ExpensesCard: React.FC<ExpensesCardProps> = ({
  totalExpenses,
  salary,
}) => {
  const rate = salary > 0 ? (totalExpenses / salary) * 100 : 0;

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
      <View className="w-10 h-10 rounded-2xl bg-error/10 items-center justify-center mb-3">
        <Ionicons name="trending-down-outline" size={20} color={Colors.error} />
      </View>
      <Text className="text-xs font-inter-medium text-textSecondary-light dark:text-textSecondary-dark mb-1">
        Total Expenses
      </Text>
      <Text className="text-2xl font-inter-extrabold text-error mb-1">
        {formatCurrency(totalExpenses)}
      </Text>
      <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
        {formatPercentage(rate, 1)} of income
      </Text>
    </View>
  );
};
