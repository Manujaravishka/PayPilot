import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../../theme";

interface MonthlyReport {
  month: number;
  year: number;
  totalExpenses: number;
  savingsRate: number;
}

interface LineChartWidgetProps {
  trend: {
    monthlyReports: MonthlyReport[];
    averageMonthlySpending: number;
    averageSavingsRate: number;
  };
}

const MONTHS = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const LineChartWidget: React.FC<LineChartWidgetProps> = ({ trend }) => {
  const { monthlyReports } = trend;

  if (!monthlyReports || monthlyReports.length === 0) {
    return (
      <View className="items-center py-8">
        <Text className="text-sm font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
          No trend data available
        </Text>
      </View>
    );
  }

  const maxExpense = Math.max(...monthlyReports.map((r) => r.totalExpenses), 1);

  return (
    <View className="py-4">
      <View className="flex-row items-end justify-between h-40 mb-2">
        {monthlyReports.slice(-6).map((report, index) => {
          const height = (report.totalExpenses / maxExpense) * 100;
          return (
            <View key={index} className="items-center flex-1 mx-1">
              <Text className="text-[9px] font-inter-regular text-textSecondary-light dark:text-textSecondary-dark mb-1">
                Rs. {report.totalExpenses.toFixed(0)}
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
                {MONTHS[report.month]}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="flex-row justify-center mt-4 gap-6">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-sm bg-primary" />
          <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
            Spending
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-sm bg-success" />
          <Text className="text-xs font-inter-regular text-textSecondary-light dark:text-textSecondary-dark">
            Savings
          </Text>
        </View>
      </View>
    </View>
  );
};
