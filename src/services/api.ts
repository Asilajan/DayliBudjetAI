const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface Transaction {
  id: number;
  name: string;
  amount: number;
  status: string;
  date: string;
  category?: string;
  tags?: string[];
}

interface SupabaseTransaction {
  id: number;
  produit: string;
  prix_u: number;
  quantite: number;
  total: number;
  categorie?: string;
  nature?: string;
  correspondant?: string;
  date_ticket: string;
  tags_str?: string;
  source_id?: string;
  created_at: string;
}

interface SupabaseResponse {
  transactions: SupabaseTransaction[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  console.log("Fetching data from Supabase...");

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/ingest-transactions?limit=200`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Supabase error: ${error}`);
    }

    const json: SupabaseResponse = await response.json();
    const records = json.transactions || [];

    console.log(`${records.length} transactions loaded from Supabase`);

    return records.map((record) => ({
      id: record.id,
      name: record.produit || "Sans nom",
      amount: -Math.abs(record.total || record.prix_u || 0),
      status: 'completed',
      date: record.date_ticket ? new Date(record.date_ticket).toISOString() : new Date().toISOString(),
      category: record.nature || record.categorie || "Non classe",
      tags: record.tags_str ? record.tags_str.split(',').map(t => t.trim()) : []
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
