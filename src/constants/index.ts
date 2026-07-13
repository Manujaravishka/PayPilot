export const ONBOARDING_PAGES = [
  {
    id: "welcome",
    title: "Take Control of\nYour Salary",
    description:
      "Manage your monthly income, track expenses, and achieve your financial goals with PayPilot.",
    icon: "wallet-outline",
  },
  {
    id: "track",
    title: "Know Your\nDaily Budget",
    description:
      "See exactly how much you can spend each day after fixed expenses and savings.",
    icon: "trending-up-outline",
  },
  {
    id: "save",
    title: "Save &\nGrow",
    description:
      "Set savings goals, track your progress, and watch your wealth grow.",
    icon: "save-outline",
  },
] as const;

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
  { id: "other", label: "Other", icon: "ellipsis-horizontal-outline", color: "#64748B" },
] as const;

export const GOAL_TYPES = [
  { id: "laptop", label: "Buy Laptop", icon: "laptop-outline", color: "#00A651" },
  { id: "phone", label: "New Phone", icon: "phone-portrait-outline", color: "#EC4899" },
  { id: "vacation", label: "Vacation", icon: "umbrella-outline", color: "#06B6D4" },
  { id: "emergency", label: "Emergency Fund", icon: "shield-checkmark-outline", color: "#EF4444" },
  { id: "debt", label: "Debt Payment", icon: "cash-outline", color: "#F59E0B" },
  { id: "investment", label: "Investment", icon: "trending-up-outline", color: "#22C55E" },
  { id: "purchase", label: "Big Purchase", icon: "cart-outline", color: "#8B5CF6" },
  { id: "custom", label: "Custom Goal", icon: "flag-outline", color: "#6366F1" },
] as const;

export const FIXED_EXPENSE_CATEGORIES = [
  { id: "rent", label: "Rent", icon: "home-outline", color: "#EF4444" },
  { id: "loan", label: "Loan", icon: "card-outline", color: "#F59E0B" },
  { id: "electricity", label: "Electricity", icon: "flash-outline", color: "#F97316" },
  { id: "water", label: "Water", icon: "water-outline", color: "#06B6D4" },
  { id: "internet", label: "Internet", icon: "wifi-outline", color: "#6366F1" },
  { id: "mobile", label: "Mobile", icon: "phone-portrait-outline", color: "#EC4899" },
  { id: "insurance", label: "Insurance", icon: "shield-outline", color: "#22C55E" },
  { id: "subscriptions", label: "Subscriptions", icon: "layers-outline", color: "#8B5CF6" },
  { id: "custom", label: "Custom", icon: "add-outline", color: "#64748B" },
] as const;
