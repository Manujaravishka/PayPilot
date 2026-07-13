import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { formatCurrency, formatShortDate, getCategoryData } from "../../utils/formatters";

interface ExpenseCardProps {
  title: string;
  amount: number;
  category: string;
  notes?: string;
  date: number;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({
  title,
  amount,
  category,
  notes,
  date,
}) => {
  const cat = getCategoryData(category);

  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 mb-2.5 flex-row items-center"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View
        className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
        style={{ backgroundColor: `${cat.color}15` }}
      >
        <Ionicons name={cat.icon as any} size={22} color={cat.color} />
      </View>

      <View className="flex-1">
        <Text className="text-base font-inter-semibold text-textPrimary-light dark:text-textPrimary-dark">
          {title}
        </Text>
        <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark mt-0.5">
          {cat.label} · {formatShortDate(date)}
        </Text>
        {notes ? (
          <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark mt-0.5" numberOfLines={1}>
            {notes}
          </Text>
        ) : null}
      </View>

      <Text className="text-base font-inter-bold text-textPrimary-light dark:text-textPrimary-dark">
        - Rs. {amount.toLocaleString()}
      </Text>
    </View>
  );
};
