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
  pageInfo: {
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

const API_URL = import.meta.env.VITE_NOCODB_API_URL;
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'xc-token': API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NocoDBResponse = await response.json();

    return data.list.map((item) => ({
      id: item.Id,
      name: item.Produit,
      amount: -Math.abs(item.Prix),
      status: 'completed',
      date: item.Date,
      category: item.Categorie,
      tags: item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : []
    }));
  } catch (error) {
    console.error('Error fetching transactions from NocoDB:', error);
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
