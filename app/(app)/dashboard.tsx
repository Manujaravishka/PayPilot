import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../src/features/auth/store/authStore";
import { useTransactionStore } from "../../src/features/transactions/store/transactionStore";
import { useGoalStore } from "../../src/features/goals/store/goalStore";
import { Colors } from "../../src/theme";
import { formatShortDate } from "../../src/utils/formatters";
import { getCategory } from "../../src/features/transactions/types/transaction";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function getDaysRemaining(): number {
  const now = new Date();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.max(1, totalDays - now.getDate());
}

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { transactions, fetchTransactions } = useTransactionStore();
  const { goals, fetchGoals, getGoalCalculations } = useGoalStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetchTransactions(user.uid);
      fetchGoals(user.uid);
    }
  }, [user?.uid]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const monthlyData = useMemo(() => {
    const month = transactions.filter((t) => t.date >= monthStart);
    const income = month.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = month.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions, monthStart]);

  const todayExpenses = useMemo(
    () => transactions
      .filter((t) => t.type === "expense" && t.date >= todayStart.getTime())
      .reduce((s, t) => s + t.amount, 0),
    [transactions, todayStart],
  );

  const daysRemaining = getDaysRemaining();
  const dailyBudget = monthlyData.balance > 0 ? monthlyData.balance / daysRemaining : 0;
  const overspent = todayExpenses > dailyBudget && dailyBudget > 0;

  const recentTransactions = useMemo(
    () => [...transactions].sort((a, b) => b.date - a.date).slice(0, 5),
    [transactions],
  );

  const activeGoals = useMemo(
    () => goals.filter((g) => !getGoalCalculations(g).isCompleted).slice(0, 2),
    [goals],
  );

  const budgetUsage = monthlyData.income > 0 ? (monthlyData.expense / monthlyData.income) * 100 : 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user?.uid) {
      await Promise.all([fetchTransactions(user.uid), fetchGoals(user.uid)]);
    }
    setRefreshing(false);
  }, [user?.uid]);

  return (
    <View className="flex-1" style={{ backgroundColor: "#F8FAFC" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <LinearGradient colors={Colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-6 pt-14 pb-8">
          <View className="flex-row justify-between items-center mb-2">
            <View>
              <Text className="text-sm font-inter-medium text-white/80">{getGreeting()}</Text>
              <Text className="text-2xl font-inter-bold text-white mt-0.5 tracking-tight">
                {user?.displayName || "User"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/profile")} className="w-11 h-11 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)", borderWidth: 2, borderColor: "rgba(255,255,255,0.3)" }}>
              <Text className="text-white font-inter-bold text-lg">{user?.displayName?.[0] || "U"}</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View className="-mt-7 px-4">
          <View className="rounded-3xl p-6 mb-4" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 }}>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-inter-medium text-textSecondary-light">Current Balance</Text>
              <View className="flex-row items-center rounded-full px-3 py-1" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                <View className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: Colors.primary }} />
                <Text className="text-xs font-inter-semibold" style={{ color: Colors.primary }}>{daysRemaining} days left</Text>
              </View>
            </View>
            <Text className="text-4xl font-inter-extrabold mb-4 tracking-tight" style={{ color: "#111827" }}>
              Rs. {monthlyData.balance.toLocaleString()}
            </Text>
            <View className="flex-row justify-between pt-4 border-t" style={{ borderColor: "#E2E8F0" }}>
              <TouchableOpacity onPress={() => router.push("/transactions")} className="flex-1">
                <Text className="text-xs font-inter-medium text-textSecondary-light">Total Income</Text>
                <Text className="text-base font-inter-bold mt-0.5 text-success">Rs. {monthlyData.income.toLocaleString()}</Text>
              </TouchableOpacity>
              <View className="w-px bg-borderLight mx-3" />
              <TouchableOpacity onPress={() => router.push("/transactions")} className="flex-1 items-end">
                <Text className="text-xs font-inter-medium text-textSecondary-light">Total Expenses</Text>
                <Text className="text-base font-inter-bold mt-0.5 text-error">-Rs. {monthlyData.expense.toLocaleString()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/add")}
            className="rounded-3xl p-5 mb-4"
            style={{ backgroundColor: overspent ? "rgba(239, 68, 68, 0.06)" : "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <View className="flex-row justify-between items-center mb-1">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: overspent ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 166, 81, 0.08)" }}>
                  <Ionicons name={overspent ? "warning-outline" : "shield-checkmark-outline"} size={20} color={overspent ? Colors.error : Colors.success} />
                </View>
                <View>
                  <Text className="text-sm font-inter-regular text-textSecondary-light">
                    {overspent ? "Overspent Today!" : "Daily Spending Limit"}
                  </Text>
                  <Text className="text-xl font-inter-bold mt-0.5" style={{ color: overspent ? Colors.error : "#111827" }}>
                    Rs. {dailyBudget.toLocaleString()}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </View>
            <Text className="text-xs font-inter-regular text-textSecondary-light mt-2">
              {monthlyData.balance > 0
                ? `Rs. ${monthlyData.balance.toLocaleString()} remaining ÷ ${daysRemaining} days`
                : "Add income to unlock daily budget"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-3 mb-4">
            {[
              { label: "Income", value: `Rs. ${monthlyData.income.toLocaleString()}`, color: Colors.success, icon: "trending-up-outline", bgColor: "rgba(34, 197, 94, 0.08)", route: "/transactions" },
              { label: "Expenses", value: `Rs. ${monthlyData.expense.toLocaleString()}`, color: Colors.error, icon: "arrow-down-outline", bgColor: "rgba(239, 68, 68, 0.08)", route: "/transactions" },
              { label: "Budget", value: `${budgetUsage.toFixed(0)}%`, color: budgetUsage > 80 ? Colors.error : budgetUsage > 50 ? Colors.warning : Colors.success, icon: "pie-chart-outline", bgColor: "rgba(6, 182, 212, 0.08)", route: "/reports" },
            ].map((stat) => (
              <TouchableOpacity
                key={stat.label}
                onPress={() => router.push(stat.route as any)}
                className="flex-1 rounded-2xl p-4"
                style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
              >
                <View className="w-9 h-9 rounded-2xl items-center justify-center mb-2" style={{ backgroundColor: stat.bgColor }}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text className="text-xs font-inter-medium text-textSecondary-light">{stat.label}</Text>
                <Text className="text-lg font-inter-bold mt-0.5" style={{ color: stat.color }}>{stat.value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {monthlyData.income > 0 && (
            <View className="rounded-3xl p-5 mb-4" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-inter-semibold" style={{ color: "#111827" }}>Budget Usage</Text>
                <Text className="text-sm font-inter-bold" style={{ color: "#111827" }}>{budgetUsage.toFixed(0)}%</Text>
              </View>
              <View className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
                <View className="h-full rounded-full" style={{ width: `${Math.min(budgetUsage, 100)}%`, backgroundColor: budgetUsage >= 100 ? Colors.error : budgetUsage >= 80 ? Colors.warning : Colors.primary }} />
              </View>
              <View className="flex-row justify-between mt-1.5">
                <Text className="text-xs font-inter-regular text-textSecondary-light">Rs. {monthlyData.expense.toLocaleString()} spent</Text>
                <Text className="text-xs font-inter-regular text-textSecondary-light">Rs. {Math.max(0, monthlyData.income - monthlyData.expense).toLocaleString()} left</Text>
              </View>
            </View>
          )}

          {activeGoals.length > 0 && (
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3 px-1">
                <Text className="text-base font-inter-bold" style={{ color: "#111827" }}>Savings Goals</Text>
                <TouchableOpacity onPress={() => router.push("/reports")}>
                  <Text className="text-sm font-inter-semibold" style={{ color: Colors.primary }}>View All</Text>
                </TouchableOpacity>
              </View>
              {activeGoals.map((goal) => {
                const calc = getGoalCalculations(goal);
                return (
                  <View key={goal.id} className="rounded-2xl p-4 mb-2" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: "#F1F5F9" }}>
                    <View className="flex-row items-center gap-3 mb-2">
                      <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
                        <Ionicons name="flag-outline" size={20} color={Colors.success} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-inter-semibold" style={{ color: "#111827" }}>{goal.name}</Text>
                        <Text className="text-xs font-inter-regular text-textSecondary-light">{calc.remaining} days left</Text>
                      </View>
                      <Text className="text-sm font-inter-bold" style={{ color: "#111827" }}>Rs. {goal.currentAmount.toLocaleString()}</Text>
                    </View>
                    <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
                      <View className="h-full rounded-full" style={{ width: `${Math.min(calc.progress, 100)}%`, backgroundColor: Colors.primary }} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {recentTransactions.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-3 px-1">
                <Text className="text-base font-inter-bold" style={{ color: "#111827" }}>Recent Activity</Text>
                <TouchableOpacity onPress={() => router.push("/transactions")}>
                  <Text className="text-sm font-inter-semibold" style={{ color: Colors.primary }}>View All</Text>
                </TouchableOpacity>
              </View>
              {recentTransactions.map((tx) => {
                const cat = getCategory(tx.category);
                return (
                  <View key={tx.id} className="rounded-2xl p-4 mb-2 flex-row items-center" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
                    <View className="w-11 h-11 rounded-2xl items-center justify-center mr-3" style={{ backgroundColor: `${cat.color}15` }}>
                      <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-inter-semibold" style={{ color: "#111827" }}>{cat.label}</Text>
                      <Text className="text-xs font-inter-regular text-textSecondary-light mt-0.5">{formatShortDate(tx.date)}{tx.note ? ` · ${tx.note}` : ""}</Text>
                    </View>
                    <Text className={`text-sm font-inter-bold ${tx.type === "income" ? "text-success" : "text-error"}`}>
                      {tx.type === "income" ? "+" : "-"}Rs. {tx.amount.toLocaleString()}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}

          {transactions.length === 0 && (
            <View className="items-center py-16 rounded-3xl mb-6" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                <Ionicons name="wallet-outline" size={36} color={Colors.primary} />
              </View>
              <Text className="text-xl font-inter-bold text-center mb-2" style={{ color: "#111827" }}>No Transactions Yet</Text>
              <Text className="text-sm font-inter-regular text-textSecondary-light text-center px-8 mb-6">Add your first income or expense to get started</Text>
              <TouchableOpacity
                onPress={() => router.push("/add")}
                className="px-8 py-3.5 rounded-2xl"
                style={{ backgroundColor: Colors.primary }}
              >
                <Text className="text-white font-inter-semibold text-base">Add Transaction</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
