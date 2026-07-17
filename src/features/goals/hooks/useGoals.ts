import { useEffect, useCallback } from "react";
import { useGoalStore } from "../store/goalStore";

export const useGoals = (userId?: string) => {
  const store = useGoalStore();

  useEffect(() => {
    if (userId) {
      store.fetchGoals(userId).catch(() => {});
    }
  }, [userId]);

  const activeGoals = store.goals.filter((g) => !store.getGoalCalculations(g).isCompleted);
  const completedGoals = store.goals.filter((g) => store.getGoalCalculations(g).isCompleted);
  const totalSaved = store.goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = store.goals.reduce((s, g) => s + g.targetAmount, 0);

  return {
    ...store,
    activeGoals,
    completedGoals,
    totalSaved,
    totalTarget,
  };
};