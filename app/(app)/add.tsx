import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../src/features/auth/store/authStore";
import { useTransactionStore } from "../../src/features/transactions/store/transactionStore";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "../../src/features/transactions/types/transaction";
import { Colors } from "../../src/theme";
import { Button } from "../../src/components/ui/Button";
import { useThemeStore } from "../../src/features/theme/store/themeStore";
import { themeColor } from "../../src/features/theme/utils";

export default function AddScreen() {
  const user = useAuthStore((s) => s.user);
  const { isLoading, addTransaction } = useTransactionStore();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");

  const isDark = useThemeStore((s) => s.isDark);
  const c = (color: any) => themeColor(color, isDark);

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  React.useEffect(() => {
    setCategory(categories[0].id);
  }, [type]);

  const handleSubmit = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "You must be logged in");
      return;
    }
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }
    const parsedDate = new Date(date).getTime();
    if (isNaN(parsedDate)) {
      Alert.alert("Error", "Please enter a valid date (YYYY-MM-DD)");
      return;
    }

    try {
      await addTransaction(user.uid, {
        type,
        amount: numAmount,
        category,
        date: parsedDate,
        note: note.trim(),
      });
      Alert.alert("Success", type === "income" ? "Income added!" : "Expense added!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save");
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: c(Colors.background) }}>
      <LinearGradient colors={Colors.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="px-6 pt-16 pb-8">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 rounded-2xl items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <Ionicons name="close" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text className="text-xl font-inter-bold text-white">Add Transaction</Text>
          <View className="w-10" />
        </View>

        <View className="flex-row bg-white/20 rounded-2xl p-1">
          {(["expense", "income"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              className="flex-1 py-3 rounded-xl items-center flex-row justify-center"
              style={{ backgroundColor: type === t ? c(Colors.surface) : "transparent" }}
            >
              <Ionicons
                name={t === "expense" ? "arrow-down-outline" : "arrow-up-outline"}
                size={16}
                color={type === t ? (t === "expense" ? Colors.error : Colors.success) : "#FFFFFF"}
                style={{ marginRight: 6 }}
              />
              <Text className="text-sm font-inter-semibold" style={{ color: type === t ? c(Colors.textPrimary) : c(Colors.surface) }}>
                {t === "expense" ? "Expense" : "Income"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView className="flex-1 px-4 -mt-3" showsVerticalScrollIndicator={false}>
        <View className="rounded-3xl p-5 mb-4" style={{ backgroundColor: c(Colors.surface), shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
          <Text className="text-sm font-inter-medium mb-2" style={{ color: c(Colors.textSecondary) }}>Amount</Text>
          <TextInput
            className="rounded-2xl px-5 py-4 text-3xl font-inter-bold text-center"
            style={{ backgroundColor: c(Colors.border), color: c(Colors.textPrimary) }}
            placeholder="0"
            placeholderTextColor="#CBD5E1"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text className="text-sm font-inter-medium mt-5 mb-3" style={{ color: c(Colors.textSecondary) }}>Category</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                className="flex-row items-center px-4 py-2.5 rounded-full"
                style={{ backgroundColor: category === cat.id ? Colors.primary : c(Colors.border) }}
              >
                <Ionicons name={cat.icon as any} size={16} color={category === cat.id ? "#FFFFFF" : cat.color} style={{ marginRight: 6 }} />
                <Text className="text-sm font-inter-medium" style={{ color: category === cat.id ? c(Colors.surface) : c(Colors.textPrimary) }}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-sm font-inter-medium mb-2" style={{ color: c(Colors.textSecondary) }}>Date</Text>
          <TextInput
            className="rounded-2xl px-4 py-3.5 text-base font-inter-medium mb-4"
            style={{ backgroundColor: c(Colors.border), color: c(Colors.textPrimary) }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94A3B8"
            value={date}
            onChangeText={setDate}
          />

          <Text className="text-sm font-inter-medium mb-2" style={{ color: c(Colors.textSecondary) }}>Note (optional)</Text>
          <TextInput
            className="rounded-2xl px-4 py-3.5 text-base font-inter-medium mb-6"
            style={{ backgroundColor: c(Colors.border), color: c(Colors.textPrimary) }}
            placeholder="Add details..."
            placeholderTextColor="#94A3B8"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={2}
          />

          <Button
            title={type === "income" ? "Add Income" : "Add Expense"}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
