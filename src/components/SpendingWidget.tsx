import { motion } from 'framer-motion';
import { TrendingDown } from 'lucide-react';
import { spendingCategories } from '../data/mockData';

export function SpendingWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingDown className="w-5 h-5 text-white" />
        <h2 className="text-white font-medium">Spending</h2>
      </div>

      <div className="space-y-5">
        {spendingCategories.map((category, index) => {
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
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.05 }}
                  className="absolute h-full rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[#6f6f6f]">
                  {category.amount.toLocaleString()} €
                </span>
                <span className="text-xs text-[#6f6f6f]">
                  of {category.budget.toLocaleString()} €
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
