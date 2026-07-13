export const formatCurrency = (
  amount: number,
  currency = "Rs.",
  decimals = 0,
): string => {
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatShortDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const formatMonthYear = (month: number, year: number): string => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[month - 1]} ${year}`;
};

export const formatPercentage = (value: number, decimals = 0): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDays = (days: number): string => {
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return "#EF4444";
  if (progress >= 75) return "#F59E0B";
  if (progress >= 50) return "#22C55E";
  return "#00A651";
};

export const getCategoryData = (categoryId: string) => {
  const categories: Record<string, { label: string; icon: string; color: string }> = {
    food: { label: "Food", icon: "fast-food-outline", color: "#EF4444" },
    transport: { label: "Transport", icon: "car-outline", color: "#F59E0B" },
    shopping: { label: "Shopping", icon: "bag-outline", color: "#EC4899" },
    entertainment: { label: "Entertainment", icon: "tv-outline", color: "#06B6D4" },
    health: { label: "Health", icon: "fitness-outline", color: "#22C55E" },
    education: { label: "Education", icon: "school-outline", color: "#6366F1" },
    bills: { label: "Bills", icon: "document-text-outline", color: "#8B5CF6" },
    family: { label: "Family", icon: "people-outline", color: "#14B8A6" },
    travel: { label: "Travel", icon: "airplane-outline", color: "#F97316" },
    other: { label: "Other", icon: "ellipsis-horizontal-outline", color: "#64748B" },
  };
  return categories[categoryId] || categories.other;
};
