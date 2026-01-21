import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, TrendingUp, Coffee, Lightbulb } from 'lucide-react';
import { analyzeBudget } from '../utils/budgetAnalyzer';
import type { Transaction } from '../services/api';

const iconMap = {
  AlertTriangle,
  TrendingUp,
  Coffee,
  Lightbulb
};

interface InsightsWidgetProps {
  transactions: Transaction[];
}

export function InsightsWidget({ transactions }: InsightsWidgetProps) {
  const insights = analyzeBudget(transactions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-white" />
        <h2 className="text-white font-medium">Analyses</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.icon];

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.02, borderColor: insight.color }}
              className="bg-[#0a0a0a] border border-[#2f2f2f] rounded-xl p-4 cursor-pointer transition-all"
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: `${insight.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: insight.color }} />
                </div>
                <p className="text-sm text-[#d1d1d1] leading-relaxed">
                  {insight.message}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Posez une question à l'IA..."
          className="w-full bg-[#0a0a0a] border border-[#2f2f2f] rounded-lg px-4 py-3 text-white placeholder-[#6f6f6f] focus:outline-none focus:border-[#4f4f4f] transition-colors"
        />
        <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6f6f6f]" />
      </div>
    </motion.div>
  );
}
