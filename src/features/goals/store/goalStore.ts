import { create } from "zustand";
import { firestoreService } from "../../../services/firestore";
import type { Goal, GoalCalculations } from "../types/goal";

interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  totalSaved: number;
  totalTarget: number;
}

interface GoalStore extends GoalState {
  fetchGoals: (userId: string) => Promise<void>;
  addGoal: (userId: string, data: Omit<Goal, "id" | "userId" | "currentAmount" | "createdAt" | "updatedAt">) => Promise<void>;
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getGoalCalculations: (goal: Goal) => GoalCalculations;
  recalculateTotals: () => void;
  reset: () => void;
}

const calcGoal = (goal: Goal): GoalCalculations => {
  const progress = goal.targetAmount > 0
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0);
  const now = Date.now();
  const diff = goal.targetDate - now;
  const daysRemaining = Math.max(0, Math.ceil(diff / 86400000));

  return {
    progress,
    remaining,
    daysRemaining,
    isCompleted: goal.currentAmount >= goal.targetAmount,
  };
};

const initialState: GoalState = {
  goals: [],
  isLoading: false,
  error: null,
  totalSaved: 0,
  totalTarget: 0,
};

export const useGoalStore = create<GoalStore>((set, get) => ({
  ...initialState,

  fetchGoals: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const goals = await firestoreService.listByUser<Goal>("goals", userId);
      set({ goals, isLoading: false });
      get().recalculateTotals();
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addGoal: async (userId, data) => {
    set({ error: null });
    try {
      const goalData = { ...data, userId, currentAmount: 0 };
      const id = await firestoreService.add("goals", goalData);
      const goal: Goal = {
        ...goalData,
        id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      set((state) => ({ goals: [...state.goals, goal] }));
      get().recalculateTotals();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateGoal: async (id, data) => {
    try {
      await firestoreService.update("goals", id, data);
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...data, updatedAt: Date.now() } : g,
        ),
      }));
      get().recalculateTotals();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteGoal: async (id) => {
    try {
      await firestoreService.delete("goals", id);
      set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
      get().recalculateTotals();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  getGoalCalculations: (goal) => calcGoal(goal),

  recalculateTotals: () => {
    const { goals } = get();
    const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
    const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
    set({ totalSaved, totalTarget });
  },

  reset: () => set(initialState),
}));
