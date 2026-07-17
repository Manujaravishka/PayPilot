import { useEffect, useRef } from "react";
import { useAuth } from "./useAuth";
import { useAuthStore } from "../features/auth/store/authStore";
import { useTransactionStore } from "../features/transactions/store/transactionStore";
import { useGoalStore } from "../features/goals/store/goalStore";
import { useSalaryStore } from "../features/salary/store/salaryStore";
import { useNotificationStore } from "../features/notifications/store/notificationStore";

export function AuthBridge({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const resetTransactions = useTransactionStore((s) => s.reset);
  const resetGoals = useGoalStore((s) => s.reset);
  const resetSalary = useSalaryStore((s) => s.reset);
  const clearNotifications = useNotificationStore((s) => s.clearNotifications);
  const prevUser = useRef(user);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (prevUser.current && !user) {
      resetTransactions();
      resetGoals();
      resetSalary();
      clearNotifications();
    }
    prevUser.current = user;
  }, [user, resetTransactions, resetGoals, resetSalary, clearNotifications]);

  return <>{children}</>;
}
