// Configuration API NocoDB
const API_URL = "http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=100&sort=-Id";
const API_TOKEN = "KOYudfXyj3Ry6TQGtiJ1gfqKC9gUPDIWGrmqWvCm";

// Interface pour les données reçues de NocoDB
export interface NocoDBTransaction {
  Id: number;
  Produit: string;
  Prix: number;
  Date: string;
  Categorie: string;
  Total: number;
  Tags: string;
}

export interface NocoDBResponse {
  list: NocoDBTransaction[];
  pageInfo?: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

// Interface pour l'application
export interface Transaction {
  id: number;
  name: string;
  amount: number;
  status: string;
  date: string;
  category?: string;
  tags?: string[];
}

// Récupération des transactions depuis NocoDB
export async function fetchTransactions(): Promise<Transaction[]> {
  console.log("🚀 Fetching data from NocoDB...");

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'xc-token': API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return [];
    }

    const json: NocoDBResponse = await response.json();
    const records = json.list || [];

    console.log(`✅ ${records.length} transactions loaded`);

    return records.map((record) => ({
      id: record.Id || Math.floor(Math.random() * 1000000),
      name: record.Produit || "Sans nom",
      amount: -Math.abs(Number(record.Prix) || 0),
      status: 'completed',
      date: record.Date ? new Date(record.Date).toISOString() : new Date().toISOString(),
      category: record.Categorie || "Non classé",
      tags: record.Tags ? String(record.Tags).split(',').map(tag => tag.trim()) : []
    }));

  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    return [];
  }
}

// Calcul des totaux par catégorie
export function calculateCategoryTotals(transactions: Transaction[]): Record<string, number> {
  const totals: Record<string, number> = {};

  transactions.forEach((transaction) => {
    if (transaction.category) {
      const category = transaction.category;
      totals[category] = (totals[category] || 0) + Math.abs(transaction.amount);
    }
  });

  return totals;
}

// Calcul du total des dépenses
export function getTotalSpending(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
}
