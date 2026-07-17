import { useNotificationStore } from "../store/notificationStore";
import { useNotificationSettingsStore } from "../store/notificationSettingsStore";
import { notificationService } from "./notificationService";

export const autoNotificationService = {
  checkConditions(params: {
    userId: string;
    salary: number;
    totalIncome: number;
    totalExpenses: number;
    lastExpenseDate: number | null;
    currentAmount: number;
    targetAmount: number;
    goals: { currentAmount: number; targetAmount: number; name: string }[];
  }): void {
    const { settings } = useNotificationSettingsStore.getState();
    const addNotification = useNotificationStore.getState().addNotification;
    const hasType = useNotificationStore.getState().hasNotificationType;

    const { salary, totalExpenses, totalIncome, lastExpenseDate, goals } = params;

    if (!settings.budgetAlerts && !settings.savingsReminders) return;

    if (settings.budgetAlerts) {
      const expenseRatio = salary > 0 ? totalExpenses / salary : 0;

      if (salary > 0 && totalExpenses >= salary) {
        if (!hasType("overspend")) {
          const title = "Expenses Exceed Salary";
          const message = `Your total expenses (Rs. ${totalExpenses.toLocaleString()}) have exceeded your salary (Rs. ${salary.toLocaleString()}).`;
          addNotification("overspend", title, message);
          notificationService.triggerLocalNotification("overspend", title, message);
        }
      } else if (expenseRatio >= 0.8) {
        if (!hasType("budget_80")) {
          const title = "You've Spent 80% of Your Salary";
          const message = `You've used 80% of your salary. Only Rs. ${Math.max(0, salary - totalExpenses).toLocaleString()} remaining.`;
          addNotification("budget_80", title, message);
          notificationService.triggerLocalNotification("budget_80", title, message);
        }
      }
    }

    if (lastExpenseDate) {
      const daysSinceLastExpense = Math.floor(
        (Date.now() - lastExpenseDate) / 86400000,
      );
      if (daysSinceLastExpense >= 3 && !hasType("idle_3_days")) {
        const title = "No Expenses Recorded";
        const message = `It's been ${daysSinceLastExpense} days since your last expense. Don't forget to track your spending!`;
        addNotification("idle_3_days", title, message);
        notificationService.triggerLocalNotification("idle_3_days", title, message);
      }
    }

    if (settings.savingsReminders) {
      for (const goal of goals) {
        if (goal.targetAmount > 0 && goal.currentAmount >= goal.targetAmount) {
          if (!hasType("goal_reached")) {
            const title = "Goal Reached!";
            const message = `Congratulations! You've reached your savings goal: ${goal.name}`;
            addNotification("goal_reached", title, message);
            notificationService.triggerLocalNotification("goal_reached", title, message);
          }
        }
      }
    }
  },
};
