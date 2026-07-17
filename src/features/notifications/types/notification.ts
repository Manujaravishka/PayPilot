export type NotificationType =
  | "expense_reminder"
  | "salary_day"
  | "monthly_summary"
  | "savings_goal"
  | "budget_warning"
  | "overspend"
  | "budget_80"
  | "budget_100"
  | "bill_reminder"
  | "idle_3_days"
  | "goal_reached"
  | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  data?: Record<string, any>;
}

export interface NotificationSettings {
  salaryReminders: boolean;
  expenseReminders: boolean;
  monthlySummary: boolean;
  savingsReminders: boolean;
  budgetAlerts: boolean;
  lastExpenseDate: number | null;
  lastSalaryNotificationDate: number | null;
  lastMonthlySummaryDate: number | null;
  lastSavingsGoalReminder: number | null;
  notified80Percent: boolean;
  notifiedOverspend: boolean;
  salaryDay: number;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  salaryReminders: true,
  expenseReminders: true,
  monthlySummary: true,
  savingsReminders: true,
  budgetAlerts: true,
  lastExpenseDate: null,
  lastSalaryNotificationDate: null,
  lastMonthlySummaryDate: null,
  lastSavingsGoalReminder: null,
  notified80Percent: false,
  notifiedOverspend: false,
  salaryDay: 1,
};
