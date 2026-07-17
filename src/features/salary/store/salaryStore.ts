import { create } from "zustand";
import { firestoreService } from "../../../services/firestore";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { SalaryRecord, MonthlyRecord } from "../types/salary";

interface SalaryState {
  salaryHistory: SalaryRecord[];
  currentSalary: number;
  monthlyRecords: MonthlyRecord[];
  isLoading: boolean;
  error: string | null;
}

interface SalaryStore extends SalaryState {
  fetchSalaryHistory: (userId: string) => Promise<void>;
  setSalary: (userId: string, amount: number) => Promise<void>;
  fetchMonthlyRecords: (userId: string) => Promise<void>;
  getOrCreateMonthlyRecord: (userId: string, month: number, year: number) => Promise<MonthlyRecord>;
  updateMonthlyRecord: (userId: string, month: number, year: number, data: Partial<MonthlyRecord>) => Promise<void>;
  recalculateMonth: (userId: string, month: number, year: number, totalIncome: number, totalExpenses: number) => Promise<void>;
  reset: () => void;
}

const initialState: SalaryState = {
  salaryHistory: [],
  currentSalary: 0,
  monthlyRecords: [],
  isLoading: false,
  error: null,
};

export const useSalaryStore = create<SalaryStore>((set, get) => ({
  ...initialState,

  fetchSalaryHistory: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const records = await firestoreService.listByUser<SalaryRecord>("salaryHistory", userId);
      const sorted = records.sort((a, b) => b.effectiveDate - a.effectiveDate);
      set((state) => ({
        salaryHistory: sorted,
        currentSalary: sorted.length > 0 ? sorted[0].amount : state.currentSalary,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ isLoading: false });
      console.error("fetchSalaryHistory failed:", err);
      throw err;
    }
  },

  setSalary: async (userId: string, amount: number) => {
    set({ isLoading: true, error: null });
    try {
      if (!db) throw new Error("Firebase not initialized");
      const salaryData = {
        userId,
        amount,
        effectiveDate: Date.now(),
        createdAt: Date.now(),
      };
      const id = await firestoreService.add("salaryHistory", salaryData);
      const record: SalaryRecord = { id, ...salaryData };
      set((state) => ({
        salaryHistory: [record, ...state.salaryHistory],
        currentSalary: amount,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchMonthlyRecords: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const records = await firestoreService.listByUser<MonthlyRecord>("monthlyRecords", userId);
      set({ monthlyRecords: records, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      console.error("fetchMonthlyRecords failed:", err);
      throw err;
    }
  },

  getOrCreateMonthlyRecord: async (userId: string, month: number, year: number) => {
    const { monthlyRecords } = get();
    const existing = monthlyRecords.find(
      (r) => r.month === month && r.year === year && r.userId === userId
    );
    if (existing) return existing;

    if (!db) throw new Error("Firebase not initialized");
    const docId = `${userId}_${year}_${month}`;
    const now = Date.now();
    const newRecord: MonthlyRecord = {
      id: docId,
      userId,
      month,
      year,
      salary: 0,
      totalIncome: 0,
      totalExpenses: 0,
      savings: 0,
      remainingBalance: 0,
      notes: "",
      locked: false,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, "monthlyRecords", docId), {
      ...newRecord,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    set((state) => ({ monthlyRecords: [...state.monthlyRecords, newRecord] }));
    return newRecord;
  },

  updateMonthlyRecord: async (userId: string, month: number, year: number, data: Partial<MonthlyRecord>) => {
    if (!db) throw new Error("Firebase not initialized");
    const docId = `${userId}_${year}_${month}`;
    await firestoreService.update("monthlyRecords", docId, data);
    set((state) => ({
      monthlyRecords: state.monthlyRecords.map((r) =>
        r.month === month && r.year === year && r.userId === userId
          ? { ...r, ...data, updatedAt: Date.now() }
          : r
      ),
    }));
  },

  recalculateMonth: async (userId: string, month: number, year: number, totalIncome: number, totalExpenses: number) => {
    const { currentSalary } = get();
    const savings = Math.max(0, totalIncome - totalExpenses);
    const remainingBalance = totalIncome - totalExpenses;

    await get().updateMonthlyRecord(userId, month, year, {
      salary: currentSalary,
      totalIncome,
      totalExpenses,
      savings,
      remainingBalance,
      locked: isMonthLocked(month, year),
    });
  },

  reset: () => set(initialState),
}));

function isMonthLocked(month: number, year: number): boolean {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  if (year < currentYear) return true;
  if (year === currentYear && month < currentMonth) return true;
  return false;
}
