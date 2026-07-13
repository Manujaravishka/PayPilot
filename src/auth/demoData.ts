import type { Transaction } from "../features/transactions/types/transaction";
import type { Goal, GoalType } from "../features/goals/types/goal";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const EXPENSE_TITLES: Record<string, string[]> = {
  food: ["Lunch at Cafe", "Dinner at Restaurant", "Groceries", "Coffee & Snacks", "Breakfast", "Food Delivery"],
  transport: ["Fuel", "Bus Fare", "Uber Ride", "Taxi", "Train Ticket", "Parking Fee"],
  shopping: ["Clothes", "Shoes", "Home Decor", "Kitchen Items", "Online Shopping"],
  entertainment: ["Movie Tickets", "Concert", "Game Night", "Streaming Subscription", "Amusement Park"],
  health: ["Pharmacy", "Doctor Visit", "Gym Fee", "Vitamins", "Health Checkup"],
  education: ["Online Course", "Books", "Workshop", "Tutorial Subscription", "Study Materials"],
  bills: ["Electricity Bill", "Water Bill", "Internet Bill", "Phone Bill", "Gas Bill"],
  family: ["Kids School", "Family Dinner", "Gifts", "Family Outing", "Parents Allowance"],
  travel: ["Flight Ticket", "Hotel Booking", "Travel Insurance", "Tour Package", "Bus Ticket"],
  other: ["ATM Fee", "Bank Charges", "Miscellaneous", "Gift", "Donation"],
};

function randomAmount(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(days: number): number {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0);
  return d.getTime();
}

const CATEGORIES = ["food", "transport", "shopping", "entertainment", "health", "education", "bills", "family", "travel", "other"];

export function getDemoTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  for (let day = 0; day < 30; day++) {
    const dayCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < dayCount; i++) {
      const cat = randomItem(CATEGORIES);
      const titles = EXPENSE_TITLES[cat];
      const title = randomItem(titles);
      transactions.push({
        id: generateId(),
        userId: "demo-user",
        type: "expense",
        amount: randomAmount(cat === "bills" ? 500 : 50, cat === "food" ? 2500 : cat === "shopping" ? 15000 : 5000),
        category: cat,
        note: Math.random() > 0.7 ? title : "",
        date: daysAgo(day),
        createdAt: daysAgo(day),
      });
    }
  }
  transactions.push({
    id: generateId(),
    userId: "demo-user",
    type: "income",
    amount: 150000,
    category: "salary",
    note: "Monthly salary",
    date: daysAgo(0),
    createdAt: Date.now(),
  });
  return transactions.sort((a, b) => b.date - a.date);
}

export function getDemoGoals(): Goal[] {
  return [
    { id: generateId(), userId: "demo-user", name: "New MacBook Pro", type: "purchase", targetAmount: 350000, currentAmount: 125000, targetDate: Date.now() + 180 * 86400000, createdAt: Date.now() - 60 * 86400000, updatedAt: Date.now() - 5 * 86400000 },
    { id: generateId(), userId: "demo-user", name: "Bali Vacation", type: "vacation", targetAmount: 250000, currentAmount: 85000, targetDate: Date.now() + 120 * 86400000, createdAt: Date.now() - 30 * 86400000, updatedAt: Date.now() - 2 * 86400000 },
    { id: generateId(), userId: "demo-user", name: "Emergency Fund", type: "emergency", targetAmount: 500000, currentAmount: 200000, targetDate: Date.now() + 365 * 86400000, createdAt: Date.now() - 120 * 86400000, updatedAt: Date.now() - 10 * 86400000 },
    { id: generateId(), userId: "demo-user", name: "iPhone 16", type: "phone", targetAmount: 200000, currentAmount: 200000, targetDate: Date.now() - 10 * 86400000, createdAt: Date.now() - 90 * 86400000, updatedAt: Date.now() - 10 * 86400000 },
  ];
}
