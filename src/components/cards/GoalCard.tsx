import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { formatCurrency, formatDays, formatPercentage, getProgressColor } from "../../utils/formatters";

interface GoalCardProps {
  name: string;
  type: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: number;
  onPress?: () => void;
  onAddMoney?: () => void;
}

const GOAL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  laptop: "laptop-outline",
  phone: "phone-portrait-outline",
  vacation: "umbrella-outline",
  emergency: "shield-checkmark-outline",
  debt: "cash-outline",
  investment: "trending-up-outline",
  purchase: "cart-outline",
  custom: "flag-outline",
};

const GOAL_COLORS: Record<string, string> = {
  laptop: "#00A651",
  phone: "#EC4899",
  vacation: "#06B6D4",
  emergency: "#EF4444",
  debt: "#F59E0B",
  investment: "#22C55E",
  purchase: "#8B5CF6",
  custom: "#6366F1",
};

export const GoalCard: React.FC<GoalCardProps> = ({
  name,
  type,
  targetAmount,
  currentAmount,
  targetDate,
  onPress,
  onAddMoney,
}) => {
  const icon = GOAL_ICONS[type] || "flag-outline";
  const color = GOAL_COLORS[type] || Colors.primary;
  const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  const remaining = targetAmount - currentAmount;
  const daysRemaining = Math.max(0, Math.ceil((targetDate - Date.now()) / 86400000));
  const isCompleted = currentAmount >= targetAmount;
  const progressColor = getProgressColor(progress);

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
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Ionicons name={icon} size={22} color={color} />
          </View>
          <View>
            <Text className="text-base font-inter-semibold text-textPrimary-light dark:text-textPrimary-dark">
              {name}
            </Text>
            <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark capitalize">
              {type === "laptop" ? "Buy Laptop" :
               type === "phone" ? "New Phone" :
               type === "vacation" ? "Vacation" :
               type === "emergency" ? "Emergency Fund" :
               type === "debt" ? "Debt Payment" :
               type === "investment" ? "Investment" :
               type === "purchase" ? "Big Purchase" : "Custom Goal"}
            </Text>
          </View>
        </View>
        {isCompleted ? (
          <View className="bg-success/10 rounded-lg px-3 py-1.5">
            <Text className="text-xs font-inter-semibold text-success">
              Completed
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            onPress={onAddMoney}
            className="bg-primary/10 rounded-lg px-3 py-1.5"
          >
            <Text className="text-xs font-inter-semibold text-primary">
              + Add
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-sm font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
          Rs. {currentAmount.toLocaleString()} of Rs. {targetAmount.toLocaleString()}
        </Text>
        {!isCompleted && (
          <Text className="text-sm font-inter-bold text-textPrimary-light dark:text-textPrimary-dark">
            Rs. {remaining.toLocaleString()} left
          </Text>
        )}
      </View>

      <View className="h-3 bg-background-light dark:bg-background-dark rounded-full overflow-hidden mb-2">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: progressColor,
          }}
        />
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
          {formatPercentage(progress, 1)} complete
        </Text>
        <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
          {formatDays(daysRemaining)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
