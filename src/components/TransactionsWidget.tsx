import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle } from 'lucide-react';
import { transactions } from '../data/mockData';

export function TransactionsWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center gap-2 mb-6">
        <ArrowUpRight className="w-5 h-5 text-white" />
        <h2 className="text-white font-medium">Transactions</h2>
      </div>

      <div className="space-y-1">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            whileHover={{ backgroundColor: '#0f0f0f' }}
            className="flex items-center justify-between p-3 rounded-lg transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1a1a1a] rounded-lg">
                {transaction.amount > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-[#a1a1a1]" />
                )}
              </div>
              <div>
                <div className="text-sm text-white">{transaction.name}</div>
                <div className="text-xs text-[#6f6f6f]">{transaction.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${
                  transaction.amount > 0 ? 'text-green-500' : 'text-white'
                }`}
              >
                {transaction.amount > 0 ? '+' : ''}
                {transaction.amount.toLocaleString()} €
              </span>
              {transaction.status === 'pending' ? (
                <Clock className="w-4 h-4 text-yellow-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
