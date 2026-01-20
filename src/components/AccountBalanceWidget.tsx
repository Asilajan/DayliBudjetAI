import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { accounts } from '../data/mockData';

export function AccountBalanceWidget() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center gap-2 mb-6">
        <Wallet className="w-5 h-5 text-white" />
        <h2 className="text-white font-medium">Account Balance</h2>
      </div>

      <div className="relative h-64 flex items-center justify-center">
        {accounts.map((account, index) => {
          const size = (account.balance / totalBalance) * 180 + 60;
          const offset = index === 0 ? -30 : 30;

          return (
            <motion.div
              key={account.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="absolute rounded-full border-2 flex items-center justify-center cursor-pointer group"
              style={{
                width: size,
                height: size,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: account.color,
                left: `calc(50% + ${offset}px)`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-xs text-[#a1a1a1] mb-1">{account.name}</div>
                <div className="text-xl text-white font-semibold">
                  {account.balance.toLocaleString()} {account.currency}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        {accounts.map((account, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: account.color }}
              />
              <span className="text-sm text-[#a1a1a1]">{account.name}</span>
            </div>
            <span className="text-sm text-white font-medium">
              {account.balance.toLocaleString()} {account.currency}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
