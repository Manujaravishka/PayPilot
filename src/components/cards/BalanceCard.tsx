import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../theme";
import { AnimatedCounter } from "../ui/AnimatedCounter";

interface BalanceCardProps {
  totalIncome: number;
  remainingBalance: number;
  fixedExpenses: number;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  totalIncome,
  remainingBalance,
  fixedExpenses,
}) => {
  return (
    <LinearGradient
      colors={Colors.primaryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-6 pt-6 pb-8 rounded-3xl"
      style={{
        shadowColor: "#00A651",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-sm font-inter-medium text-white/80">
          Available Balance
        </Text>
        <View className="flex-row items-center bg-white/15 rounded-full px-3 py-1.5">
          <Ionicons name="shield-checkmark" size={14} color="#fff" />
          <Text className="text-xs font-inter-semibold text-white ml-1.5">
            Secure
          </Text>
        </View>
      </View>

      <AnimatedCounter
        value={remainingBalance}
        prefix="Rs. "
        decimals={0}
        style={{
          fontSize: 38,
          fontFamily: "Inter_800ExtraBold",
          color: Colors.white,
          marginBottom: 8,
          letterSpacing: -1,
        }}
      />

      <View className="flex-row justify-between mt-4 pt-4 border-t border-white/15">
        <View>
          <Text className="text-xs font-inter-medium text-white/70">
            Monthly Income
          </Text>
          <Text className="text-lg font-inter-bold text-white mt-0.5">
            Rs. {totalIncome.toLocaleString()}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-inter-medium text-white/70">
            Fixed Expenses
          </Text>
          <Text className="text-lg font-inter-bold text-white/90 mt-0.5">
            - Rs. {fixedExpenses.toLocaleString()}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};
