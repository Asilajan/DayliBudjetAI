const NOCODB_API_URL = 'http://192.168.1.11:8085/api/v2/tables/mdzbaovwu0orw88/records';
const NOCODB_TOKEN = 'c22e92a6-2a3d-4edf-a98e-4044834daea6';
const VIEW_ID = 'vwxltw3juurlv7mx';

export interface Transaction {
  id: number;
  name: string;
  amount: number;
  status: string;
  date: string;
  category?: string;
  tags?: string[];
}

interface NocoDBRecord {
  Id: number;
  Produit: string;
  Prix?: number;
  Prix_U?: number;
  prix?: number;
  Date: string;
  Categorie?: string;
  Tags?: string;
}

interface NocoDBResponse {
  list: NocoDBRecord[];
  pageInfo: {
    totalRows?: number;
    page?: number;
    pageSize?: number;
  };
}

export async function fetchTransactions(): Promise<Transaction[]> {
  console.log("Fetching data from NocoDB...");

  try {
    const url = `${NOCODB_API_URL}?offset=0&limit=100&viewId=${VIEW_ID}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'xc-token': NOCODB_TOKEN,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`NocoDB API error (${response.status}):`, error);
      return [];
    }

    const json: NocoDBResponse = await response.json();
    const records = json.list || [];

    console.log(`${records.length} transactions loaded from NocoDB`);

    return records.map((record) => {
      const prix = record.Prix || record.Prix_U || record.prix || 0;
      const amountValue = typeof prix === 'number' ? prix : parseFloat(String(prix)) || 0;

      let tagsArray: string[] = [];
      if (record.Tags) {
        if (typeof record.Tags === 'string') {
          tagsArray = record.Tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
        } else if (Array.isArray(record.Tags)) {
          tagsArray = record.Tags;
        }
      }

      return {
        id: record.Id,
        name: record.Produit || "Sans nom",
        amount: -Math.abs(amountValue),
        status: 'completed',
        date: record.Date || new Date().toISOString().split('T')[0],
        category: record.Categorie || "Non classé",
        tags: tagsArray
      };
    });

  } catch (error) {
    console.error("Error fetching transactions from NocoDB:", error);
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

export async function syncFromN8N(): Promise<void> {
  console.log("Refreshing data from NocoDB...");
  return Promise.resolve();
}
