export const suggestions = [
  "How much did I earn last month?",
  "Show me all recurring costs",
  "What's my biggest expense?",
  "Monthly spending trend"
];

export const trackerData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  intensity: Math.random() > 0.3 ? Math.floor(Math.random() * 3) : 0
}));

export const accounts = [
  { name: "SEB Företagskonto", balance: 36500, currency: "€", color: "#ffffff" },
  { name: "SEB Sparkonto", balance: 10500, currency: "€", color: "#7c7c7c" }
];

export const spendingCategories = [
  { name: "Equipment", amount: 12500, budget: 15000, color: "#3b82f6" },
  { name: "Rent", amount: 8000, budget: 8000, color: "#8b5cf6" },
  { name: "Travel", amount: 4200, budget: 6000, color: "#ec4899" },
  { name: "Software", amount: 3800, budget: 5000, color: "#10b981" },
  { name: "Marketing", amount: 2100, budget: 4000, color: "#f59e0b" },
  { name: "Other", amount: 1500, budget: 3000, color: "#6366f1" }
];

export const transactions = [
  { id: 1, name: "Stripe Payment", amount: 4500, status: "completed", date: "2026-01-15" },
  { id: 2, name: "Office Supplies", amount: -250, status: "completed", date: "2026-01-14" },
  { id: 3, name: "AWS Services", amount: -180, status: "completed", date: "2026-01-14" },
  { id: 4, name: "Client Invoice", amount: 8200, status: "pending", date: "2026-01-13" },
  { id: 5, name: "Software License", amount: -590, status: "completed", date: "2026-01-12" },
  { id: 6, name: "Consulting Fee", amount: 3100, status: "completed", date: "2026-01-11" },
  { id: 7, name: "Café Expresso", amount: -3.5, status: "completed", date: "2026-01-18" },
  { id: 8, name: "Café Expresso", amount: -3.5, status: "completed", date: "2026-01-17" },
  { id: 9, name: "Café Expresso", amount: -3.5, status: "completed", date: "2026-01-16" },
  { id: 10, name: "Café Expresso", amount: -3.5, status: "completed", date: "2026-01-15" },
  { id: 11, name: "Café Expresso", amount: -3.5, status: "completed", date: "2026-01-14" },
  { id: 12, name: "MacBook Pro", amount: -2499, status: "completed", date: "2026-01-10" },
  { id: 13, name: "Restaurant", amount: -85, status: "completed", date: "2026-01-09" }
];

export const inboxItems = [
  { id: 1, name: "Vercel", description: "Invoice #4521", status: "pending", icon: "Globe" },
  { id: 2, name: "Apple Music", description: "Subscription renewal", status: "done", icon: "Music" },
  { id: 3, name: "GitHub", description: "Team plan payment", status: "pending", icon: "Github" },
  { id: 4, name: "Figma", description: "Professional plan", status: "done", icon: "Figma" }
];
