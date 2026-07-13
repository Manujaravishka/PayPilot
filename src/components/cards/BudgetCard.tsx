import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { formatCurrency } from "../../utils/formatters";
import { CategoryIcon } from "../ui/CategoryIcon";

interface BudgetCardProps {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  onPress?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  category,
  budgetAmount,
  spentAmount,
  onPress,
}) => {
  const progress = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
  const remaining = budgetAmount - spentAmount;
  const isOverspent = spentAmount > budgetAmount;

  const barColor = isOverspent
    ? Colors.error
    : progress > 75
    ? Colors.warning
    : Colors.success;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-surface-light dark:bg-surface-dark rounded-3xl p-5 mb-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-3">
          <CategoryIcon category={category} size={18} />
          <Text className="text-base font-inter-semibold text-textPrimary-light dark:text-textPrimary-dark capitalize">
            {category}
          </Text>
        </View>
        {isOverspent && (
          <View className="bg-error/10 rounded-lg px-2.5 py-1">
            <Text className="text-xs font-inter-semibold text-error">
              Overspent
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-sm font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
          {formatCurrency(spentAmount)} of {formatCurrency(budgetAmount)}
        </Text>
        <Text
          className={`text-sm font-inter-bold ${
            isOverspent ? "text-error" : "text-success"
          }`}
        >
          {isOverspent ? `+${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining)}
        </Text>
      </View>

      <View className="h-2.5 bg-background-light dark:bg-background-dark rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: barColor,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};
