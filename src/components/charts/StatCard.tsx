import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { AnimatedCounter } from "../ui/AnimatedCounter";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  decimals?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  prefix = "Rs. ",
  suffix = "",
  icon,
  color,
  decimals = 0,
}) => {
  return (
    <View className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm flex-1">
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <AnimatedCounter
        value={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        style={{
          fontSize: 20,
          fontFamily: "Inter_800ExtraBold",
          color: Colors.textPrimary.light,
          marginBottom: 2,
        }}
      />
      <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
        {label}
      </Text>
    </View>
  );
};
