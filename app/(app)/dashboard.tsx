import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../src/features/auth/store/authStore";
import { useTransactionStore } from "../../src/features/transactions/store/transactionStore";
import { useGoalStore } from "../../src/features/goals/store/goalStore";
import { useSalaryStore } from "../../src/features/salary/store/salaryStore";
import { useNotificationSettingsStore } from "../../src/features/notifications/store/notificationSettingsStore";
import { useThemeStore } from "../../src/features/theme/store/themeStore";
import { themeColor } from "../../src/features/theme/utils";
import { autoNotificationService } from "../../src/features/notifications/services/autoNotificationService";
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
  const { currentSalary, salaryHistory, fetchSalaryHistory, setSalary, recalculateMonth } = useSalaryStore();
  const isDark = useThemeStore((s) => s.isDark);
  const c = (color: any) => themeColor(color, isDark);
  const [refreshing, setRefreshing] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryInput, setSalaryInput] = useState("");

  const settings = useNotificationSettingsStore((s) => s.settings);
  const updateSetting = useNotificationSettingsStore((s) => s.updateSetting);
  const { lastExpenseDate } = settings;

  useEffect(() => {
    if (user?.uid) {
      fetchTransactions(user.uid).catch(() => {});
      fetchGoals(user.uid).catch(() => {});
      fetchSalaryHistory(user.uid).catch(() => {});
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      if (user?.uid) {
        fetchTransactions(user.uid).catch(() => {});
        fetchGoals(user.uid).catch(() => {});
        fetchSalaryHistory(user.uid).catch(() => {});
      }
    }, [user?.uid]),
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const monthlyData = useMemo(() => {
    const month = transactions.filter((t) => t.date >= monthStart);
    const income = month.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = month.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions, monthStart]);

  useEffect(() => {
    if (!user?.uid) return;
    const expenseTxs = transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.date - a.date);
    const latestExpenseDate = expenseTxs.length > 0 ? expenseTxs[0].date : null;
    if (latestExpenseDate && (!lastExpenseDate || latestExpenseDate > lastExpenseDate)) {
      updateSetting("lastExpenseDate", latestExpenseDate);
    }
    autoNotificationService.checkConditions({
      userId: user.uid,
      salary: currentSalary,
      totalIncome: monthlyData.income,
      totalExpenses: monthlyData.expense,
      lastExpenseDate: lastExpenseDate || latestExpenseDate,
      currentAmount: 0,
      targetAmount: 0,
      goals: goals.map((g) => ({
        currentAmount: g.currentAmount,
        targetAmount: g.targetAmount,
        name: g.name,
      })),
    });
  }, [monthlyData.income, monthlyData.expense, currentSalary, goals, transactions]);

  useEffect(() => {
    if (user?.uid && transactions.length > 0) {
      recalculateMonth(user.uid, currentMonth, currentYear, monthlyData.income, monthlyData.expense)
        .catch((err) => console.warn("recalculateMonth failed:", err));
    }
  }, [monthlyData.income, monthlyData.expense, currentMonth, currentYear]);

  const todayExpenses = useMemo(
    () => transactions
      .filter((t) => t.type === "expense" && t.date >= new Date().setHours(0, 0, 0, 0))
      .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );

  const daysRemaining = getDaysRemaining();
  const remainingBalance = currentSalary + monthlyData.income - monthlyData.expense;
  const dailyBudget = remainingBalance > 0 ? remainingBalance / daysRemaining : 0;
  const overspent = todayExpenses > dailyBudget && dailyBudget > 0;
  const savingsProgress = currentSalary > 0 ? ((remainingBalance / currentSalary) * 100) : 0;

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
      await Promise.all([
        fetchTransactions(user.uid).catch(() => {}),
        fetchGoals(user.uid).catch(() => {}),
        fetchSalaryHistory(user.uid).catch(() => {}),
      ]);
    }
    setRefreshing(false);
  }, [user?.uid]);

  const handleSetSalary = async () => {
    const amount = Number(salaryInput);
    if (!amount || amount <= 0) {
      Alert.alert("Error", "Please enter a valid salary amount");
      return;
    }
    if (!user?.uid) return;
    try {
      await setSalary(user.uid, amount);
      setShowSalaryModal(false);
      setSalaryInput("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to set salary");
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: c(Colors.background) }}>
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
          <View className="rounded-3xl p-6 mb-4" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 4 }}>
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-sm font-inter-medium" style={{ color: c(Colors.textSecondary) }}>Remaining Balance</Text>
              <View className="flex-row items-center rounded-full px-3 py-1" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                <View className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: Colors.primary }} />
                <Text className="text-xs font-inter-semibold" style={{ color: Colors.primary }}>{daysRemaining} days left</Text>
              </View>
            </View>
            <Text className="text-4xl font-inter-extrabold mb-4 tracking-tight" style={{ color: c(Colors.textPrimary) }}>
              Rs. {remainingBalance.toLocaleString()}
            </Text>
            <View className="flex-row justify-between pt-4 border-t" style={{ borderColor: c(Colors.border) }}>
              <TouchableOpacity onPress={() => router.push("/transactions")} className="flex-1">
                <Text className="text-xs font-inter-medium" style={{ color: c(Colors.textSecondary) }}>Monthly Salary</Text>
                <Text className="text-base font-inter-bold mt-0.5" style={{ color: Colors.primary }}>Rs. {currentSalary.toLocaleString()}</Text>
              </TouchableOpacity>
              <View className="w-px bg-borderLight mx-3" />
              <TouchableOpacity onPress={() => router.push("/transactions")} className="flex-1 items-end">
                <Text className="text-xs font-inter-medium" style={{ color: c(Colors.textSecondary) }}>Total Expenses</Text>
                <Text className="text-base font-inter-bold mt-0.5 text-error">-Rs. {monthlyData.expense.toLocaleString()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/add")}
            className="rounded-3xl p-5 mb-4"
            style={{ backgroundColor: overspent ? "rgba(239, 68, 68, 0.06)" : c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <View className="flex-row justify-between items-center mb-1">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: overspent ? "rgba(239, 68, 68, 0.1)" : "rgba(0, 166, 81, 0.08)" }}>
                  <Ionicons name={overspent ? "warning-outline" : "shield-checkmark-outline"} size={20} color={overspent ? Colors.error : Colors.success} />
                </View>
                <View>
                  <Text className="text-sm font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                    {overspent ? "Overspent Today!" : "Daily Spending Limit"}
                  </Text>
                  <Text className="text-xl font-inter-bold mt-0.5" style={{ color: overspent ? Colors.error : c(Colors.textPrimary) }}>
                    Rs. {dailyBudget.toLocaleString()}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={c(Colors.textSecondary)} />
            </View>
            <Text className="text-xs font-inter-regular mt-2" style={{ color: c(Colors.textSecondary) }}>
              {remainingBalance > 0
                ? `Rs. ${remainingBalance.toLocaleString()} remaining ÷ ${daysRemaining} days`
                : "Set your salary and add income to unlock daily budget"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-3 mb-4">
            {[
              { label: "Salary", value: `Rs. ${currentSalary.toLocaleString()}`, color: Colors.primary, icon: "cash-outline", bgColor: "rgba(0, 166, 81, 0.08)", route: "" as const, action: () => {
                setSalaryInput(String(currentSalary || ""));
                setShowSalaryModal(true);
              }},
              { label: "Expenses", value: `Rs. ${monthlyData.expense.toLocaleString()}`, color: Colors.error, icon: "arrow-down-outline", bgColor: "rgba(239, 68, 68, 0.08)", route: "/transactions" as const },
              { label: "Savings", value: `${savingsProgress.toFixed(0)}%`, color: savingsProgress > 0 ? Colors.success : Colors.textSecondaryLight, icon: "pie-chart-outline", bgColor: "rgba(34, 197, 94, 0.08)", route: "/reports" as const },
            ].map((stat) => (
              <TouchableOpacity
                key={stat.label}
                onPress={stat.action || (() => router.push(stat.route as any))}
                className="flex-1 rounded-2xl p-4"
                style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
              >
                <View className="w-9 h-9 rounded-2xl items-center justify-center mb-2" style={{ backgroundColor: stat.bgColor }}>
                  <Ionicons name={stat.icon as any} size={18} color={stat.color} />
                </View>
                <Text className="text-xs font-inter-medium" style={{ color: c(Colors.textSecondary) }}>{stat.label}</Text>
                <Text className="text-lg font-inter-bold mt-0.5" style={{ color: stat.color }}>{stat.value}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {currentSalary > 0 && (
            <View className="rounded-3xl p-5 mb-4" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>Savings Progress</Text>
                <Text className="text-sm font-inter-bold" style={{ color: savingsProgress >= 20 ? Colors.success : Colors.warning }}>{savingsProgress.toFixed(0)}%</Text>
              </View>
              <View className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: c(Colors.border) }}>
                <View className="h-full rounded-full" style={{ width: `${Math.min(savingsProgress, 100)}%`, backgroundColor: savingsProgress >= 20 ? Colors.primary : Colors.warning }} />
              </View>
              <View className="flex-row justify-between mt-1.5">
                <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                  Saved: Rs. {remainingBalance.toLocaleString()}
                </Text>
                <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                  of Rs. {currentSalary.toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {activeGoals.length > 0 && (
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3 px-1">
                <Text className="text-base font-inter-bold" style={{ color: c(Colors.textPrimary) }}>Savings Goals</Text>
                <TouchableOpacity onPress={() => router.push("/reports")}>
                  <Text className="text-sm font-inter-semibold" style={{ color: Colors.primary }}>View All</Text>
                </TouchableOpacity>
              </View>
              {activeGoals.map((goal) => {
                const calc = getGoalCalculations(goal);
                return (
                  <View key={goal.id} className="rounded-2xl p-4 mb-2" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: c(Colors.border) }}>
                    <View className="flex-row items-center gap-3 mb-2">
                      <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
                        <Ionicons name="flag-outline" size={20} color={Colors.success} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>{goal.name}</Text>
                        <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>{calc.remaining} days left</Text>
                      </View>
                      <Text className="text-sm font-inter-bold" style={{ color: c(Colors.textPrimary) }}>Rs. {goal.currentAmount.toLocaleString()}</Text>
                    </View>
                    <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: c(Colors.border) }}>
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
                <Text className="text-base font-inter-bold" style={{ color: c(Colors.textPrimary) }}>Recent Activity</Text>
                <TouchableOpacity onPress={() => router.push("/transactions")}>
                  <Text className="text-sm font-inter-semibold" style={{ color: Colors.primary }}>View All</Text>
                </TouchableOpacity>
              </View>
              {recentTransactions.map((tx) => {
                const cat = getCategory(tx.category);
                return (
                  <View key={tx.id} className="rounded-2xl p-4 mb-2 flex-row items-center" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
                    <View className="w-11 h-11 rounded-2xl items-center justify-center mr-3" style={{ backgroundColor: `${cat.color}15` }}>
                      <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>{cat.label}</Text>
                      <Text className="text-xs font-inter-regular mt-0.5" style={{ color: c(Colors.textSecondary) }}>{formatShortDate(tx.date)}{tx.note ? ` · ${tx.note}` : ""}</Text>
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
            <View className="items-center py-16 rounded-3xl mb-6" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                <Ionicons name="wallet-outline" size={36} color={Colors.primary} />
              </View>
              <Text className="text-xl font-inter-bold text-center mb-2" style={{ color: c(Colors.textPrimary) }}>No Transactions Yet</Text>
              <Text className="text-sm font-inter-regular text-center px-8 mb-6" style={{ color: c(Colors.textSecondary) }}>Add your first income or expense to get started</Text>
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

      <Modal visible={showSalaryModal} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-8">
          <View className="rounded-3xl p-6 w-full" style={{ backgroundColor: c(Colors.surface) }}>
            <Text className="text-lg font-inter-bold text-center mb-4" style={{ color: c(Colors.textPrimary) }}>Set Monthly Salary</Text>
            <Text className="text-xs font-inter-medium text-center mb-4" style={{ color: c(Colors.textSecondary) }}>
              Your salary is used to calculate savings and remaining balance.
              Each update is saved as a historical record.
            </Text>
            <TextInput
              className="rounded-2xl px-5 py-4 text-3xl font-inter-bold text-center mb-4"
              style={{ backgroundColor: c(Colors.border), color: c(Colors.textPrimary) }}
              placeholder="0"
              placeholderTextColor="#CBD5E1"
              keyboardType="numeric"
              value={salaryInput}
              onChangeText={setSalaryInput}
            />
            {salaryHistory.length > 0 && (
              <View className="mb-4 rounded-2xl p-3" style={{ backgroundColor: c(Colors.background) }}>
                <Text className="text-xs font-inter-semibold mb-2" style={{ color: c(Colors.textSecondary) }}>Salary History</Text>
                {salaryHistory.slice(0, 5).map((rec) => (
                  <View key={rec.id} className="flex-row justify-between py-1">
                    <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                      {new Date(rec.effectiveDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </Text>
                    <Text className="text-xs font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>
                      Rs. {rec.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowSalaryModal(false)}
                className="flex-1 py-3.5 rounded-2xl items-center"
                style={{ backgroundColor: c(Colors.border) }}
              >
                <Text className="text-base font-inter-semibold" style={{ color: c(Colors.textSecondary) }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSetSalary}
                className="flex-1 py-3.5 rounded-2xl items-center"
                style={{ backgroundColor: Colors.primary }}
              >
                <Text className="text-base font-inter-semibold text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
