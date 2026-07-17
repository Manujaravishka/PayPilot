export interface SalaryRecord {
  id: string;
  userId: string;
  amount: number;
  effectiveDate: number;
  createdAt: number;
}

export interface MonthlyRecord {
  id: string;
  userId: string;
  month: number;
  year: number;
  salary: number;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  remainingBalance: number;
  notes: string;
  locked: boolean;
  createdAt: number;
  updatedAt: number;
}
