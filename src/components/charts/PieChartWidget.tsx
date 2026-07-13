import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../../theme";

interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
}

interface PieChartWidgetProps {
  data: CategoryTotal[];
}

const CHART_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.success,
  Colors.warning,
  Colors.error,
  "#06B6D4",
  "#EC4899",
  "#F97316",
  "#8B5CF6",
  "#64748B",
];

export const PieChartWidget: React.FC<PieChartWidgetProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className="text-sm font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
          No data available
        </Text>
      </View>
    );
  }

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <View>
      <View className="flex-row flex-wrap justify-center mb-4">
        {data.slice(0, 6).map((item, index) => {
          const color = CHART_COLORS[index % CHART_COLORS.length];
          const angle = (item.percentage / 100) * 360;
          return (
            <View key={item.category} className="flex-row items-center mx-2 my-1">
              <View
                className="w-3 h-3 rounded-sm mr-1.5"
                style={{ backgroundColor: color }}
              />
              <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
                {item.category} ({item.percentage.toFixed(0)}%)
              </Text>
            </View>
          );
        })}
      </View>
      <View className="border-t border-border-light dark:border-border-dark pt-3">
        {data.slice(0, 5).map((item, index) => {
          const color = CHART_COLORS[index % CHART_COLORS.length];
          return (
            <View key={item.category} className="flex-row items-center py-2">
              <View className="w-1 h-8 rounded-full mr-3" style={{ backgroundColor: color }} />
              <Text className="flex-1 text-sm font-inter-medium text-textPrimary-light dark:text-textPrimary-dark capitalize">
                {item.category}
              </Text>
              <Text className="text-sm font-inter-bold text-textPrimary-light dark:text-textPrimary-dark mr-2">
                Rs. {item.amount.toFixed(0)}
              </Text>
              <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark w-10 text-right">
                {item.percentage.toFixed(0)}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
