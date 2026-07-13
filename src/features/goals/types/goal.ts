export type GoalType =
  | "laptop"
  | "vacation"
  | "emergency"
  | "phone"
  | "debt"
  | "investment"
  | "purchase"
  | "custom";

export interface Goal {
  id: string;
  userId: string;
  name: string;
  type: GoalType;
  targetAmount: number;
  currentAmount: number;
  targetDate: number;
  createdAt: number;
  updatedAt: number;
}

export interface GoalCalculations {
  progress: number;
  remaining: number;
  daysRemaining: number;
  isCompleted: boolean;
}
