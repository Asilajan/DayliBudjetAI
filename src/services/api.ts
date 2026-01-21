const API_URL = import.meta.env.VITE_NOCODB_API_URL;
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;

export interface NocoDBTransaction {
  Id?: number;
  nc_id?: number;
  Produit: string;
  Prix: string | number;
  Categorie: string;
  Date: string;
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

export interface Transaction {
  id: number;
  name: string;
  amount: number;
  status: string;
  date: string;
  category?: string;
  tags?: string[];
}

function parsePrice(prix: string | number): number {
  if (typeof prix === 'number') return prix;
  if (!prix) return 0;
  const cleaned = String(prix)
    .replace('€', '')
    .replace(/\s/g, '')
    .replace(',', '.')
    .trim();
  return parseFloat(cleaned) || 0;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  console.log("Fetching data from NocoDB...");

  try {
    const url = `${API_URL}?limit=200&sort=-Id`;
    const response = await fetch(url, {
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

    console.log(`${records.length} transactions loaded from NocoDB`);

    return records.map((record, index) => ({
      id: record.Id || record.nc_id || index + 1,
      name: record.Produit || "Sans nom",
      amount: -Math.abs(parsePrice(record.Prix)),
      status: 'completed',
      date: record.Date ? new Date(record.Date).toISOString() : new Date().toISOString(),
      category: record.Categorie || "Non classe",
      tags: []
    }));

  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

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

export function getTotalSpending(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
}
