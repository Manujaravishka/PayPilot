export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: number;
  note: string;
  createdAt: number;
}

export const INCOME_CATEGORIES = [
  { id: "salary", label: "Salary", icon: "cash-outline", color: "#22C55E" },
  { id: "freelance", label: "Freelance", icon: "laptop-outline", color: "#6366F1" },
  { id: "business", label: "Business", icon: "briefcase-outline", color: "#F59E0B" },
  { id: "investment", label: "Investment", icon: "trending-up-outline", color: "#06B6D4" },
  { id: "rental", label: "Rental", icon: "home-outline", color: "#8B5CF6" },
  { id: "gift", label: "Gift", icon: "gift-outline", color: "#EC4899" },
  { id: "refund", label: "Refund", icon: "return-down-back-outline", color: "#14B8A6" },
  { id: "other-income", label: "Other", icon: "ellipsis-horizontal-outline", color: "#64748B" },
];

export const EXPENSE_CATEGORIES = [
  { id: "food", label: "Food", icon: "fast-food-outline", color: "#EF4444" },
  { id: "transport", label: "Transport", icon: "car-outline", color: "#F59E0B" },
  { id: "shopping", label: "Shopping", icon: "bag-outline", color: "#EC4899" },
  { id: "entertainment", label: "Entertainment", icon: "tv-outline", color: "#06B6D4" },
  { id: "health", label: "Health", icon: "fitness-outline", color: "#22C55E" },
  { id: "education", label: "Education", icon: "school-outline", color: "#6366F1" },
  { id: "bills", label: "Bills", icon: "document-text-outline", color: "#8B5CF6" },
  { id: "family", label: "Family", icon: "people-outline", color: "#14B8A6" },
  { id: "travel", label: "Travel", icon: "airplane-outline", color: "#F97316" },
  { id: "other-expense", label: "Other", icon: "ellipsis-horizontal-outline", color: "#64748B" },
];

export function getCategory(id: string): { label: string; icon: string; color: string } {
  const all = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];
  return all.find((c) => c.id === id) || { label: id, icon: "ellipsis-horizontal-outline", color: "#64748B" };
}
