import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../src/features/auth/store/authStore";
import { useTransactionStore } from "../../src/features/transactions/store/transactionStore";
import { getCategory, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../src/features/transactions/types/transaction";
import { Colors } from "../../src/theme";
import { Button } from "../../src/components/ui/Button";
import { formatShortDate } from "../../src/utils/formatters";

export default function TransactionsScreen() {
  const user = useAuthStore((s) => s.user);
  const { transactions, isLoading, fetchTransactions, updateTransaction, deleteTransaction } = useTransactionStore();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [catFilter, setCatFilter] = useState("all");
  const [editTx, setEditTx] = useState<typeof transactions[0] | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editNote, setEditNote] = useState("");
  const [showDelete, setShowDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) fetchTransactions(user.uid);
  }, [user?.uid]);

  const filtered = useMemo(() => {
    let result = [...transactions].sort((a, b) => b.date - a.date);
    if (typeFilter !== "all") result = result.filter((t) => t.type === typeFilter);
    if (catFilter !== "all") result = result.filter((t) => t.category === catFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => {
        const cat = getCategory(t.category).label.toLowerCase();
        return cat.includes(q) || t.note.toLowerCase().includes(q);
      });
    }
    return result;
  }, [transactions, typeFilter, catFilter, search]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthlyIncome = transactions
    .filter((t) => t.type === "income" && t.date >= monthStart.getTime())
    .reduce((s, t) => s + t.amount, 0);
  const monthlyExpense = transactions
    .filter((t) => t.type === "expense" && t.date >= monthStart.getTime())
    .reduce((s, t) => s + t.amount, 0);

  const handleEdit = async () => {
    if (!editTx || !editAmount || Number(editAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    try {
      await updateTransaction(editTx.id, { amount: Number(editAmount), note: editNote });
      setEditTx(null);
    } catch {
      Alert.alert("Error", "Failed to update");
    }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    try {
      await deleteTransaction(showDelete);
      setShowDelete(null);
    } catch {
      Alert.alert("Error", "Failed to delete");
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#F8FAFC" }}>
      <LinearGradient colors={Colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-6 pt-16 pb-6">
        <Text className="text-xl font-inter-bold text-white mb-3">Transactions</Text>
        <View className="flex-row bg-white/20 rounded-2xl p-1">
          {(["all", "income", "expense"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTypeFilter(t)}
              className="flex-1 py-2 rounded-xl items-center"
              style={{ backgroundColor: typeFilter === t ? "rgba(255,255,255,0.25)" : "transparent" }}
            >
              <Text className="text-sm font-inter-semibold text-white">
                {t === "all" ? "All" : t === "income" ? "Income" : "Expenses"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <View className="px-4 -mt-3">
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 rounded-2xl p-3" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            <Text className="text-xs font-inter-medium text-success">Income</Text>
            <Text className="text-base font-inter-bold text-success mt-1">Rs. {monthlyIncome.toLocaleString()}</Text>
          </View>
          <View className="flex-1 rounded-2xl p-3" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}>
            <Text className="text-xs font-inter-medium text-error">Expenses</Text>
            <Text className="text-base font-inter-bold text-error mt-1">Rs. {monthlyExpense.toLocaleString()}</Text>
          </View>
        </View>

        <View className="flex-row items-center rounded-2xl px-4 mb-3" style={{ height: 48, backgroundColor: "#FFFFFF" }}>
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-3 text-base font-inter-regular"
            style={{ color: "#111827" }}
            placeholder="Search transactions..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <TouchableOpacity
            onPress={() => setCatFilter("all")}
            className="mr-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: catFilter === "all" ? Colors.primary : "#FFFFFF" }}
          >
            <Text className="text-sm font-inter-medium" style={{ color: catFilter === "all" ? "#FFFFFF" : "#111827" }}>All</Text>
          </TouchableOpacity>
          {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setCatFilter(cat.id === catFilter ? "all" : cat.id)}
              className="mr-2 px-4 py-2 rounded-full flex-row items-center"
              style={{ backgroundColor: catFilter === cat.id ? cat.color : "#FFFFFF" }}
            >
              <Ionicons name={cat.icon as any} size={14} color={catFilter === cat.id ? "#FFFFFF" : cat.color} style={{ marginRight: 6 }} />
              <Text className="text-sm font-inter-medium" style={{ color: catFilter === cat.id ? "#FFFFFF" : "#111827" }}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} className="mb-32">
          {filtered.length === 0 && !isLoading && (
            <View className="items-center py-16">
              <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: "rgba(0, 166, 81, 0.08)" }}>
                <Ionicons name="search-outline" size={28} color={Colors.primary} />
              </View>
              <Text className="text-base font-inter-semibold mb-1" style={{ color: "#111827" }}>No Transactions Found</Text>
              <Text className="text-sm font-inter-regular text-textSecondary-light text-center px-8">
                {search || catFilter !== "all" || typeFilter !== "all" ? "Try different filters" : "Add your first transaction"}
              </Text>
            </View>
          )}
          {filtered.map((tx) => {
            const cat = getCategory(tx.category);
            return (
              <View key={tx.id} className="rounded-2xl p-4 mb-2" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: "#F1F5F9" }}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-11 h-11 rounded-2xl items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                      <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-inter-semibold" style={{ color: "#111827" }}>{cat.label}</Text>
                      <Text className="text-xs font-inter-regular text-textSecondary-light mt-0.5">
                        {formatShortDate(tx.date)}{tx.note ? ` · ${tx.note}` : ""}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    <Text className={`text-base font-inter-bold ${tx.type === "income" ? "text-success" : "text-error"}`}>
                      {tx.type === "income" ? "+" : "-"}Rs. {tx.amount.toLocaleString()}
                    </Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => {
                          setEditTx(tx);
                          setEditAmount(String(tx.amount));
                          setEditNote(tx.note || "");
                        }}
                      >
                        <Ionicons name="create-outline" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowDelete(tx.id)}>
                        <Ionicons name="trash-outline" size={16} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
          <View className="h-4" />
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={() => router.push("/add")}
        className="absolute bottom-4 right-6 w-14 h-14 rounded-full items-center justify-center"
        style={{ backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 }}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>

      <Modal visible={!!editTx} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-8">
          <View className="rounded-3xl p-6 w-full" style={{ backgroundColor: "#FFFFFF" }}>
            <Text className="text-lg font-inter-bold text-center mb-4" style={{ color: "#111827" }}>Edit Transaction</Text>
            {editTx && (
              <>
                <Text className="text-xs font-inter-medium text-textSecondary-light mb-1">{getCategory(editTx.category).label} · {editTx.type === "income" ? "Income" : "Expense"}</Text>
                <TextInput
                  className="rounded-2xl px-4 py-3.5 text-xl font-inter-bold text-center mb-3"
                  style={{ backgroundColor: "#F1F5F9", color: "#111827" }}
                  keyboardType="numeric"
                  value={editAmount}
                  onChangeText={setEditAmount}
                />
                <TextInput
                  className="rounded-2xl px-4 py-3.5 text-base font-inter-medium mb-4"
                  style={{ backgroundColor: "#F1F5F9", color: "#111827" }}
                  placeholder="Note"
                  placeholderTextColor="#94A3B8"
                  value={editNote}
                  onChangeText={setEditNote}
                />
                <View className="flex-row gap-3">
                  <View className="flex-1"><Button title="Cancel" variant="outline" onPress={() => setEditTx(null)} /></View>
                  <View className="flex-1"><Button title="Save" onPress={handleEdit} /></View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={!!showDelete} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-8">
          <View className="rounded-3xl p-6 w-full" style={{ backgroundColor: "#FFFFFF" }}>
            <Text className="text-lg font-inter-bold text-center mb-2" style={{ color: "#111827" }}>Delete Transaction</Text>
            <Text className="text-sm font-inter-regular text-center mb-6" style={{ color: "#64748B" }}>This cannot be undone.</Text>
            <View className="flex-row gap-3">
              <View className="flex-1"><Button title="Cancel" variant="outline" onPress={() => setShowDelete(null)} /></View>
              <View className="flex-1"><Button title="Delete" onPress={handleDelete} /></View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
