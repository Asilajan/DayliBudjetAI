import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface SupabaseTransaction {
  id: number;
  nature: string | null;
  correspondant: string | null;
  date_ticket: string | null;
  produit: string | null;
  prix_u: number | null;
  quantite: number | null;
  total: number | null;
  tags_str: string | null;
  source_id: string | null;
  created_at: string;
  updated_at: string;
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

export async function fetchTransactions(): Promise<Transaction[]> {
  console.log("🚀 Fetching data from Supabase...");

  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date_ticket', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    const records = data || [];
    console.log(`✅ ${records.length} transactions loaded`);

    return records.map((record: SupabaseTransaction) => ({
      id: record.id,
      name: record.produit || "Sans nom",
      amount: -Math.abs(Number(record.prix_u) || 0),
      status: 'completed',
      date: record.date_ticket ? new Date(record.date_ticket).toISOString() : new Date().toISOString(),
      category: record.nature || "Non classé",
      tags: record.tags_str ? record.tags_str.split(',').map(tag => tag.trim()) : []
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
