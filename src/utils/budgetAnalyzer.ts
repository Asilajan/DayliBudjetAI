import { spendingCategories, transactions } from '../data/mockData';

export interface InsightCard {
  id: string;
  type: 'alert' | 'trend' | 'tip' | 'forecast';
  icon: 'AlertTriangle' | 'TrendingUp' | 'Coffee' | 'Lightbulb';
  message: string;
  color: string;
}

interface Transaction {
  id: number;
  name: string;
  amount: number;
  status: string;
  date: string;
}

export function analyzeBudget(transactionsData: Transaction[]): InsightCard[] {
  const insights: InsightCard[] = [];

  // 1. Alerte Dépense - Catégorie la plus élevée
  if (spendingCategories.length > 0) {
    const sortedCategories = [...spendingCategories].sort((a, b) => b.amount - a.amount);
    const topCategory = sortedCategories[0];
    const totalSpending = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const percentage = ((topCategory.amount / totalSpending) * 100).toFixed(0);

    insights.push({
      id: 'alert-1',
      type: 'alert',
      icon: 'AlertTriangle',
      message: `⚠️ Attention, ce mois-ci le poste ${topCategory.name} représente ${percentage}% de votre budget total.`,
      color: '#f59e0b'
    });
  }

  // 2. Détection de Hausse - Transactions > 50€
  const currentMonth = new Date().getMonth();
  const largeExpenses = transactionsData.filter(t => {
    const txDate = new Date(t.date);
    return txDate.getMonth() === currentMonth && t.amount < -50;
  });

  if (largeExpenses.length > 0) {
    const largest = largeExpenses.reduce((max, t) =>
      Math.abs(t.amount) > Math.abs(max.amount) ? t : max
    );

    insights.push({
      id: 'trend-1',
      type: 'trend',
      icon: 'TrendingUp',
      message: `📈 Vos dépenses semblent augmenter. Vérifiez les achats récents type '${largest.name}' (${Math.abs(largest.amount)}€).`,
      color: '#3b82f6'
    });
  }

  // 3. Conseil Économie - Items fréquents < 5€
  const smallExpenses = transactionsData.filter(t => t.amount < 0 && Math.abs(t.amount) <= 5);
  const expenseCount: Record<string, number> = {};

  smallExpenses.forEach(t => {
    expenseCount[t.name] = (expenseCount[t.name] || 0) + 1;
  });

  const frequentExpenses = Object.entries(expenseCount).filter(([_, count]) => count > 3);

  if (frequentExpenses.length > 0) {
    const [itemName, count] = frequentExpenses[0];
    insights.push({
      id: 'tip-1',
      type: 'tip',
      icon: 'Coffee',
      message: `☕ Conseil : Vous avez acheté ${count} fois '${itemName}' récemment. Une alternative en gros pourrait réduire ce coût.`,
      color: '#10b981'
    });
  }

  // 4. Prévision statique
  insights.push({
    id: 'forecast-1',
    type: 'forecast',
    icon: 'Lightbulb',
    message: `💡 Prévoyance : Pensez à garder environ 150€ de côté pour la facture EDF du mois prochain.`,
    color: '#8b5cf6'
  });

  return insights;
}
