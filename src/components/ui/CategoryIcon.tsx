import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORY_MAP: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  food: { icon: "fast-food-outline", color: "#EF4444" },
  transport: { icon: "car-outline", color: "#F59E0B" },
  shopping: { icon: "bag-outline", color: "#EC4899" },
  entertainment: { icon: "tv-outline", color: "#06B6D4" },
  health: { icon: "fitness-outline", color: "#22C55E" },
  education: { icon: "school-outline", color: "#6366F1" },
  bills: { icon: "document-text-outline", color: "#8B5CF6" },
  family: { icon: "people-outline", color: "#14B8A6" },
  travel: { icon: "airplane-outline", color: "#F97316" },
  other: { icon: "ellipsis-horizontal-outline", color: "#64748B" },
};

interface CategoryIconProps {
  category: string;
  size?: number;
  showLabel?: boolean;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 22,
  showLabel = false,
}) => {
  const config = CATEGORY_MAP[category] || CATEGORY_MAP.other;
  const label = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <View className="flex-row items-center gap-2">
      <View
        className="items-center justify-center rounded-xl"
        style={{
          width: size + 16,
          height: size + 16,
          backgroundColor: `${config.color}20`,
        }}
      >
        <Ionicons name={config.icon} size={size} color={config.color} />
      </View>
      {showLabel && (
        <Text className="text-sm font-inter-medium text-textPrimary-light dark:text-textPrimary-dark">
          {label}
        </Text>
      )}
    </View>
  );
};
