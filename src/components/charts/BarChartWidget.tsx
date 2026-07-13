import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../../theme";

interface DailyTotal {
  date: number;
  amount: number;
}

interface BarChartWidgetProps {
  data: DailyTotal[];
}

export const BarChartWidget: React.FC<BarChartWidgetProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className="text-sm font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
          No spending data for this period
        </Text>
      </View>
    );
  }

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  return (
    <View className="py-4">
      <View className="flex-row items-end justify-between h-40 mb-2">
        {data.slice(-7).map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          const day = new Date(item.date).toLocaleDateString("en-US", {
            weekday: "short",
          });
          return (
            <View key={index} className="items-center flex-1 mx-0.5">
              <Text className="text-[9px] font-inter-regular text-textSecondary-light dark:text-textSecondary-dark mb-1">
                Rs. {item.amount.toFixed(0)}
              </Text>
              <View
                className="w-full rounded-t-md"
                style={{
                  height: `${Math.max(height, 4)}%`,
                  backgroundColor: Colors.primary,
                  opacity: 0.7 + (height / 100) * 0.3,
                  minHeight: 4,
                }}
              />
              <Text className="text-[9px] font-inter-regular text-textSecondary-light dark:text-textSecondary-dark mt-1">
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
