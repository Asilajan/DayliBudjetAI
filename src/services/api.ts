// src/api.ts

// 1. CONFIGURATION
// On utilise l'adresse directe avec le ViewID pour être sûr d'avoir les bonnes données
const API_URL = "http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records?offset=0&limit=100&viewId=vwxltw3juurlv7mx";

// ⚠️ REMPLACE CECI PAR TON VRAI TOKEN (xc8-...)
const API_TOKEN = "KOYudfXyj3Ry6TQGtiJ1gfqKC9gUPDIWGrmqWvCm"; 

// 2. INTERFACES

// Ce que NocoDB nous envoie (Brut)
export interface NocoDBTransaction {
  Id: number;
  Produit: string;
  Prix_U: number;     // Attention : C'est Prix_U maintenant, pas Prix
  Date: string;       // YYYY-MM-DD
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

// Ce que ton application utilise (Interne)
export interface Transaction {
  id: number;
  name: string;
  amount: number;
  status: string;
  date: string;
  category?: string;
  tags?: string[];
}

// 3. FONCTION DE RÉCUPÉRATION (Le Pont)
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    console.log("Fetching NocoDB data...");
    
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'xc-token': API_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NocoDBResponse = await response.json();
    console.log("Data received:", data);

    // C'est ici qu'on traduit le langage NocoDB en langage Application
    return data.list.map((item) => ({
      id: item.Id,
      name: item.Produit || "Produit Inconnu", // Sécurité si vide
      // On utilise Prix_U (ton prix unitaire) ou Total si tu préfères
      amount: -Math.abs(item.Prix_U || 0), 
      status: 'completed',
      date: item.Date, // Format YYYY-MM-DD
      category: item.Categorie || "Non classé",
      tags: item.Tags ? String(item.Tags).split(',').map(tag => tag.trim()) : []
    }));

  } catch (error) {
    console.error('Error fetching transactions from NocoDB:', error);
    return [];
  }
}

// 4. FONCTIONS DE CALCUL (Indispensables pour tes graphiques)

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