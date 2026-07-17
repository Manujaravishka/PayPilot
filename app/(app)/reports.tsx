import React, { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../src/features/auth/store/authStore";
import { useTransactionStore } from "../../src/features/transactions/store/transactionStore";
import { useGoalStore } from "../../src/features/goals/store/goalStore";
import { getCategory, EXPENSE_CATEGORIES } from "../../src/features/transactions/types/transaction";
import { Colors } from "../../src/theme";
import { Button } from "../../src/components/ui/Button";
import { formatCurrency } from "../../src/utils/formatters";
import { GOAL_TYPES } from "../../src/constants";
import { useThemeStore } from "../../src/features/theme/store/themeStore";
import { themeColor } from "../../src/features/theme/utils";

export default function ReportsScreen() {
  const user = useAuthStore((s) => s.user);
  const isDark = useThemeStore((s) => s.isDark);
  const c = (color: any) => themeColor(color, isDark);
  const { transactions, fetchTransactions } = useTransactionStore();
  const { goals, isLoading: goalsLoading, fetchGoals, addGoal, updateGoal, deleteGoal, getGoalCalculations } = useGoalStore();

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalType, setGoalType] = useState("laptop");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalDays, setGoalDays] = useState("90");
  const [showAddMoney, setShowAddMoney] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    if (user?.uid) {
      fetchTransactions(user.uid).catch(() => {});
      fetchGoals(user.uid).catch(() => {});
    }
  }, [user?.uid]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const report = useMemo(() => {
    const month = transactions.filter((t) => t.date >= monthStart);
    const income = month.filter((t) => t.type === "income");
    const expense = month.filter((t) => t.type === "expense");
    const totalIncome = income.reduce((s, t) => s + t.amount, 0);
    const totalExpense = expense.reduce((s, t) => s + t.amount, 0);

    const catMap = new Map<string, number>();
    for (const e of expense) {
      catMap.set(e.category, (catMap.get(e.category) || 0) + e.amount);
    }
    const maxCat = Math.max(...Array.from(catMap.values()), 1);
    const categories = EXPENSE_CATEGORIES.map((c) => ({
      ...c,
      amount: catMap.get(c.id) || 0,
      percentage: ((catMap.get(c.id) || 0) / totalExpense) * 100,
    })).filter((c) => c.amount > 0).sort((a, b) => b.amount - a.amount);

    const dailyMap = new Map<string, number>();
    for (const e of expense) {
      const key = new Date(e.date).toISOString().split("T")[0];
      dailyMap.set(key, (dailyMap.get(key) || 0) + e.amount);
    }
    const dailySpending = Array.from(dailyMap.entries())
      .map(([date, amount]) => ({ date: new Date(date).getTime(), amount }))
      .sort((a, b) => a.date - b.date);
    const maxDaily = Math.max(...dailySpending.map((d) => d.amount), 1);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      savingsRate: Math.max(0, savingsRate),
      categories,
      dailySpending,
      maxDaily,
      count: month.length,
    };
  }, [transactions, monthStart]);

  const activeGoals = useMemo(() => goals.filter((g) => !getGoalCalculations(g).isCompleted), [goals]);
  const completedGoals = useMemo(() => goals.filter((g) => getGoalCalculations(g).isCompleted), [goals]);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const goalProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleAddGoal = async () => {
    if (!user?.uid || !goalName || !goalTarget) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      await addGoal(user.uid, {
        name: goalName,
        type: goalType as any,
        targetAmount: Number(goalTarget),
        targetDate: Date.now() + Number(goalDays) * 86400000,
      });
      setShowGoalModal(false);
      setGoalName("");
      setGoalType("laptop");
      setGoalTarget("");
      setGoalDays("90");
    } catch {
      Alert.alert("Error", "Failed to create goal");
    }
  };

  const handleAddMoney = async () => {
    if (!showAddMoney || !addAmount) return;
    const goal = goals.find((g) => g.id === showAddMoney);
    if (!goal) return;
    await updateGoal(showAddMoney, { currentAmount: goal.currentAmount + Number(addAmount) });
    setShowAddMoney(null);
    setAddAmount("");
  };

  const totalMonths = Math.max(...transactions.map((t) => t.date), 0) > 0 ? 1 : 0;
  const months = Array.from(new Set(transactions.map((t) => {
    const d = new Date(t.date);
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  }))).sort();
  const trendData = months.map((key) => {
    const [y, m] = key.split("-").map(Number);
    const mStart = new Date(y, m - 1, 1).getTime();
    const mEnd = new Date(y, m, 0).getTime();
    const monthTx = transactions.filter((t) => t.date >= mStart && t.date <= mEnd);
    const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expense = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { key, label: new Date(y, m - 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" }), income, expense };
  });
  const maxTrend = Math.max(...trendData.flatMap((d) => [d.income, d.expense]), 1);

  return (
    <View className="flex-1" style={{ backgroundColor: c(Colors.background) }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={Colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-6 pt-16 pb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-inter-bold text-white">Reports</Text>
            <Text className="text-sm font-inter-medium text-white/70">{now.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</Text>
          </View>
        </LinearGradient>

        <View className="px-4 -mt-6">
          <View className="rounded-3xl p-5 mb-4" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text className="text-base font-inter-bold mb-4" style={{ color: c(Colors.textPrimary) }}>Monthly Summary</Text>
            <View className="flex-row gap-3 mb-3">
              <View className="flex-1 rounded-2xl p-3.5" style={{ backgroundColor: "rgba(34, 197, 94, 0.08)" }}>
                <Text className="text-xs font-inter-medium text-success mb-1">Income</Text>
                <Text className="text-lg font-inter-bold text-success">Rs. {report.totalIncome.toLocaleString()}</Text>
              </View>
              <View className="flex-1 rounded-2xl p-3.5" style={{ backgroundColor: "rgba(239, 68, 68, 0.08)" }}>
                <Text className="text-xs font-inter-medium text-error mb-1">Expenses</Text>
                <Text className="text-lg font-inter-bold text-error">Rs. {report.totalExpense.toLocaleString()}</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl p-3.5" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                <Text className="text-xs font-inter-medium mb-1" style={{ color: Colors.primary }}>Balance</Text>
                <Text className="text-lg font-inter-bold" style={{ color: Colors.primary }}>Rs. {report.balance.toLocaleString()}</Text>
              </View>
              <View className="flex-1 rounded-2xl p-3.5" style={{ backgroundColor: "rgba(6, 182, 212, 0.08)" }}>
                <Text className="text-xs font-inter-medium text-info mb-1">Savings Rate</Text>
                <Text className="text-lg font-inter-bold text-info">{report.savingsRate.toFixed(0)}%</Text>
              </View>
            </View>
          </View>

          {report.categories.length > 0 && (
            <View className="rounded-3xl p-5 mb-4" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Text className="text-base font-inter-bold mb-4" style={{ color: c(Colors.textPrimary) }}>Spending by Category</Text>
              {report.categories.map((cat) => (
                <View key={cat.id} className="mb-3 last:mb-0">
                  <View className="flex-row items-center justify-between mb-1.5">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name={cat.icon as any} size={16} color={cat.color} />
                      <Text className="text-sm font-inter-medium" style={{ color: c(Colors.textPrimary) }}>{cat.label}</Text>
                    </View>
                    <Text className="text-sm font-inter-bold" style={{ color: c(Colors.textPrimary) }}>Rs. {cat.amount.toLocaleString()}</Text>
                  </View>
                  <View className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: c(Colors.border) }}>
                    <View className="h-full rounded-full" style={{ width: `${(cat.amount / Math.max(...report.categories.map((c) => c.amount), 1)) * 100}%`, backgroundColor: cat.color }} />
                  </View>
                </View>
              ))}
            </View>
          )}

          {report.dailySpending.length > 0 && (
            <View className="rounded-3xl p-5 mb-4" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Text className="text-base font-inter-bold mb-4" style={{ color: c(Colors.textPrimary) }}>Daily Spending</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ height: 160, flexDirection: "row", alignItems: "flex-end", gap: 4, paddingTop: 20 }}>
                  {report.dailySpending.map((d, i) => {
                    const height = (d.amount / report.maxDaily) * 130;
                    return (
                      <View key={i} className="items-center" style={{ width: 36 }}>
                        <Text className="text-[9px] font-inter-regular mb-1" style={{ color: c(Colors.textSecondary) }}>
                          Rs.{d.amount >= 1000 ? `${(d.amount / 1000).toFixed(0)}k` : d.amount.toFixed(0)}
                        </Text>
                        <View className="rounded-t-lg" style={{ height: Math.max(height, 4), width: 24, backgroundColor: Colors.primary, opacity: 0.6 + (height / 140) * 0.4 }} />
                        <Text className="text-[9px] font-inter-regular mt-1" style={{ color: c(Colors.textSecondary) }}>
                          {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          {trendData.length > 1 && (
            <View className="rounded-3xl p-5 mb-4" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
              <Text className="text-base font-inter-bold mb-4" style={{ color: c(Colors.textPrimary) }}>Monthly Trend</Text>
              <View style={{ height: 160, flexDirection: "row", alignItems: "flex-end", gap: 6, paddingTop: 20 }}>
                {trendData.map((m, i) => {
                  const incomeH = (m.income / maxTrend) * 120;
                  const expenseH = (m.expense / maxTrend) * 120;
                  return (
                    <View key={i} className="items-center flex-1">
                      <View className="flex-row items-end gap-1" style={{ height: 130 }}>
                        <View className="rounded-t-lg flex-1" style={{ height: Math.max(incomeH, 2), backgroundColor: Colors.success, opacity: 0.8 }} />
                        <View className="rounded-t-lg flex-1" style={{ height: Math.max(expenseH, 2), backgroundColor: Colors.error, opacity: 0.8 }} />
                      </View>
                      <Text className="text-[9px] font-inter-regular mt-1" style={{ color: c(Colors.textSecondary) }}>{m.label}</Text>
                    </View>
                  );
                })}
              </View>
              <View className="flex-row justify-center gap-4 mt-3 pt-3" style={{ borderTopWidth: 1, borderColor: c(Colors.border) }}>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-3 h-3 rounded-full bg-success" />
                  <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>Income</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <View className="w-3 h-3 rounded-full bg-error" />
                  <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>Expenses</Text>
                </View>
              </View>
            </View>
          )}

          <View className="rounded-3xl p-5 mb-8" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-inter-bold" style={{ color: c(Colors.textPrimary) }}>Savings Goals</Text>
              <TouchableOpacity
                onPress={() => setShowGoalModal(true)}
                className="px-4 py-2 rounded-xl"
                style={{ backgroundColor: Colors.primary }}
              >
                <Text className="text-white text-sm font-inter-semibold">+ New</Text>
              </TouchableOpacity>
            </View>

            {goals.length > 0 && (
              <View className="flex-row gap-3 mb-4">
                <View className="flex-1 rounded-2xl p-3" style={{ backgroundColor: "rgba(34, 197, 94, 0.08)" }}>
                  <Text className="text-xs font-inter-medium" style={{ color: c(Colors.textSecondary) }}>Saved</Text>
                  <Text className="text-base font-inter-bold text-success mt-0.5">Rs. {totalSaved.toLocaleString()}</Text>
                </View>
                <View className="flex-1 rounded-2xl p-3" style={{ backgroundColor: "rgba(6, 182, 212, 0.08)" }}>
                  <Text className="text-xs font-inter-medium" style={{ color: c(Colors.textSecondary) }}>Progress</Text>
                  <Text className="text-base font-inter-bold text-info mt-0.5">{goalProgress.toFixed(0)}%</Text>
                </View>
              </View>
            )}

            {goals.length > 0 && (
              <View className="h-3 rounded-full overflow-hidden mb-4" style={{ backgroundColor: c(Colors.border) }}>
                <View className="h-full rounded-full" style={{ width: `${Math.min(goalProgress, 100)}%`, backgroundColor: Colors.primary }} />
              </View>
            )}

            {activeGoals.map((goal) => {
              const calc = getGoalCalculations(goal);
              return (
                <TouchableOpacity
                  key={goal.id}
                  onLongPress={() => deleteGoal(goal.id)}
                  className="rounded-2xl p-4 mb-2"
                  style={{ backgroundColor: c(Colors.background) }}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
                        <Ionicons name="flag-outline" size={20} color={Colors.success} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-inter-semibold" style={{ color: c(Colors.textPrimary) }}>{goal.name}</Text>
                        <Text className="text-xs font-inter-regular" style={{ color: c(Colors.textSecondary) }}>
                          Rs. {goal.currentAmount.toLocaleString()} / Rs. {goal.targetAmount.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => { setShowAddMoney(goal.id); setAddAmount(""); }}
                      className="px-3 py-2 rounded-xl"
                      style={{ backgroundColor: Colors.primary }}
                    >
                      <Text className="text-white text-xs font-inter-semibold">Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="h-2 rounded-full overflow-hidden mt-2" style={{ backgroundColor: c(Colors.border) }}>
                    <View className="h-full rounded-full" style={{ width: `${Math.min(calc.progress, 100)}%`, backgroundColor: Colors.primary }} />
                  </View>
                </TouchableOpacity>
              );
            })}

            {completedGoals.length > 0 && (
              <>
                <Text className="text-sm font-inter-semibold mb-2 mt-2" style={{ color: c(Colors.textSecondary) }}>Completed</Text>
                {completedGoals.map((goal) => (
                  <View key={goal.id} className="rounded-2xl p-3 mb-1 flex-row items-center gap-3" style={{ backgroundColor: "rgba(34, 197, 94, 0.06)" }}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                    <Text className="text-sm font-inter-medium flex-1" style={{ color: c(Colors.textPrimary) }}>{goal.name}</Text>
                    <Text className="text-sm font-inter-bold text-success">Rs. {goal.currentAmount.toLocaleString()}</Text>
                  </View>
                ))}
              </>
            )}

            {goals.length === 0 && (
              <View className="items-center py-8">
                <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                  <Ionicons name="trophy-outline" size={28} color={Colors.primary} />
                </View>
                <Text className="text-base font-inter-semibold mb-1" style={{ color: c(Colors.textPrimary) }}>No Goals Yet</Text>
                <Text className="text-sm font-inter-regular text-center px-8 mb-4" style={{ color: c(Colors.textSecondary) }}>
                  Create savings goals to track your progress
                </Text>
                <Button title="Create Goal" onPress={() => setShowGoalModal(true)} />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal visible={showGoalModal} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="rounded-t-3xl p-6 pb-10" style={{ backgroundColor: c(Colors.surface) }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-inter-bold" style={{ color: c(Colors.textPrimary) }}>New Goal</Text>
                <TouchableOpacity onPress={() => setShowGoalModal(false)}><Ionicons name="close" size={24} color={c(Colors.textSecondary)} /></TouchableOpacity>
              </View>
              <Text className="text-sm font-inter-medium mb-3" style={{ color: c(Colors.textSecondary) }}>Type</Text>
              <View className="flex-row flex-wrap gap-2 mb-4">
                {GOAL_TYPES.map((gt) => (
                  <TouchableOpacity key={gt.id} onPress={() => setGoalType(gt.id)} className="flex-row items-center px-4 py-2.5 rounded-full" style={{ backgroundColor: goalType === gt.id ? Colors.primary : c(Colors.border) }}>
                    <Ionicons name={gt.icon as any} size={16} color={goalType === gt.id ? c(Colors.surface) : gt.color} style={{ marginRight: 6 }} />
                    <Text className="text-sm font-inter-medium" style={{ color: goalType === gt.id ? c(Colors.surface) : c(Colors.textPrimary) }}>{gt.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput className="rounded-2xl px-4 py-3.5 text-base font-inter-medium mb-4" style={{ backgroundColor: c(Colors.border), color: c(Colors.textPrimary) }} placeholder="Goal name" placeholderTextColor="#94A3B8" value={goalName} onChangeText={setGoalName} />
              <TextInput className="rounded-2xl px-4 py-3.5 text-base font-inter-medium mb-4" style={{ backgroundColor: c(Colors.border), color: c(Colors.textPrimary) }} placeholder="Target amount (Rs.)" placeholderTextColor="#94A3B8" keyboardType="numeric" value={goalTarget} onChangeText={setGoalTarget} />
              <Text className="text-sm font-inter-medium mb-2" style={{ color: c(Colors.textSecondary) }}>Target (days)</Text>
              <View className="flex-row gap-2 mb-6">
                {[{ label: "30d", value: "30" }, { label: "90d", value: "90" }, { label: "6mo", value: "180" }, { label: "1yr", value: "365" }].map((o) => (
                  <TouchableOpacity key={o.value} onPress={() => setGoalDays(o.value)} className="flex-1 py-3 rounded-xl items-center" style={{ backgroundColor: goalDays === o.value ? Colors.primary : c(Colors.border) }}>
                    <Text className="text-sm font-inter-medium" style={{ color: goalDays === o.value ? c(Colors.surface) : c(Colors.textPrimary) }}>{o.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Button title="Create Goal" onPress={handleAddGoal} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={!!showAddMoney} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-8">
          <View className="rounded-3xl p-6 w-full" style={{ backgroundColor: c(Colors.surface) }}>
            <Text className="text-lg font-inter-bold text-center mb-4" style={{ color: c(Colors.textPrimary) }}>Add Money</Text>
            <TextInput className="rounded-2xl px-4 py-3.5 text-xl font-inter-bold text-center mb-4" style={{ backgroundColor: c(Colors.border), color: c(Colors.textPrimary) }} placeholder="Amount" placeholderTextColor="#94A3B8" keyboardType="numeric" value={addAmount} onChangeText={setAddAmount} />
            <View className="flex-row gap-3">
              <View className="flex-1"><Button title="Cancel" variant="outline" onPress={() => { setShowAddMoney(null); setAddAmount(""); }} /></View>
              <View className="flex-1"><Button title="Add" onPress={handleAddMoney} /></View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
