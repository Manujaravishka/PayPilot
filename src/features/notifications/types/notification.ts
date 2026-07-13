export type NotificationType = "overspend" | "budget_80" | "budget_100" | "bill_reminder" | "salary_day" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}
