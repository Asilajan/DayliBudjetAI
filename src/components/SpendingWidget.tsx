import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { calculateCategoryTotals, type Transaction } from '../services/api';

interface SpendingWidgetProps {
  transactions: Transaction[];
}

const categoryColors: Record<string, string> = {
  'ACHAT_DETAIL': '#3b82f6',
  'RESTAURANT': '#8b5cf6',
  'TRANSPORT': '#ec4899',
  'ENTERTAINMENT': '#10b981',
  'SERVICES': '#f59e0b',
  'OTHER': '#6366f1'
};

export function SpendingWidget({ transactions }: SpendingWidgetProps) {
  const categoryTotals = calculateCategoryTotals(transactions);
  const totalSpending = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const categoriesWithBudgets = Object.entries(categoryTotals).map(([name, amount]) => ({
    name,
    amount,
    budget: amount * 1.5,
    color: categoryColors[name] || '#6366f1'
  })).sort((a, b) => b.amount - a.amount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-white" />
          <h2 className="text-white font-medium">Spending</h2>
        </div>
        <span className="text-sm text-white font-medium">
          {totalSpending.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} €
        </span>
      </div>

      <div className="space-y-5">
        {categoriesWithBudgets.length === 0 ? (
          <div className="text-center py-8 text-[#6f6f6f]">
            No spending data available
          </div>
        ) : (
          categoriesWithBudgets.map((category, index) => {
            const percentage = (category.amount / category.budget) * 100;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#a1a1a1]">{category.name}</span>
                  <span className="text-sm text-white font-medium">
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="relative h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                    className="absolute h-full rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-[#6f6f6f]">
                    {category.amount.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} €
                  </span>
                  <span className="text-xs text-[#6f6f6f]">
                    of {category.budget.toLocaleString('fr-FR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} €
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
