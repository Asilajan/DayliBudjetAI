export interface Transaction {
  id: string;
  date: string;
  name: string;
  amount: number;
  category: string;
  status: string;
}

export async function fetchTransactions(): Promise<Transaction[]> {
  console.log("🚀 CODE TOUT NEUF CHARGÉ !");

  const url = "http://casaoslenovo.duckdns.org:8085/api/v2/tables/mdzbaovwu0orw88/records?limit=100&sort=-Id";
  const token = "KOYudfXyj3Ry6TQGtiJ1gfqKC9gUPDIWGrmqWvCm";

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xc-token': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) return [];

    const json = await response.json();
    const records = json.list || [];

    return records.map((record: any) => ({
      id: record.Id?.toString() || Math.random().toString(),
      date: record.Date ? new Date(record.Date).toISOString() : new Date().toISOString(),
      name: record.Produit || "Sans nom",
      amount: Number(record.Prix || 0),
      category: record.Categorie || "Non classé",
      status: "completed"
    }));

  } catch (error) {
    console.error("Erreur:", error);
    return [];
  }
}