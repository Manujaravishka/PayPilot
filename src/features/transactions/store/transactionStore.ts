import { create } from "zustand";
import { firestoreService } from "../../../services/firestore";
import type { Transaction } from "../types/transaction";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

interface TransactionStore extends TransactionState {
  fetchTransactions: (userId: string) => Promise<void>;
  addTransaction: (userId: string, data: Omit<Transaction, "id" | "userId" | "createdAt">) => Promise<void>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
};

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  ...initialState,

  fetchTransactions: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await firestoreService.listByUser<Transaction>("transactions", userId);
      set({ transactions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      console.error("fetchTransactions failed:", err);
      throw err;
    }
  },

  addTransaction: async (userId, data) => {
    set({ isLoading: true, error: null });
    try {
      const txData: Transaction = {
        id: "",
        userId,
        type: data.type,
        amount: data.amount,
        category: data.category,
        date: data.date,
        note: data.note || "",
        createdAt: Date.now(),
      };
      const id = await firestoreService.add("transactions", txData);
      const { transactions } = get();
      set({
        transactions: [{ ...txData, id }, ...transactions].sort((a, b) => b.date - a.date),
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateTransaction: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await firestoreService.update("transactions", id, data);
      const { transactions } = get();
      set({
        transactions: transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await firestoreService.delete("transactions", id);
      const { transactions } = get();
      set({
        transactions: transactions.filter((t) => t.id !== id),
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  reset: () => set(initialState),
}));
