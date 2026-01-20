import { useState, useEffect } from 'react';
import { InsightsWidget } from './components/InsightsWidget';
import { TrackerWidget } from './components/TrackerWidget';
import { AccountBalanceWidget } from './components/AccountBalanceWidget';
import { SpendingWidget } from './components/SpendingWidget';
import { TransactionsWidget } from './components/TransactionsWidget';
import { InboxWidget } from './components/InboxWidget';
import { fetchTransactions, type Transaction } from './services/api';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      setLoading(true);
      const data = await fetchTransactions();
      setTransactions(data);
      setLoading(false);
    }

    loadTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Dashboard</h1>
          <p className="text-[#a1a1a1]">Track your finances in real-time</p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading your data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
            <div className="lg:col-span-2">
              <InsightsWidget transactions={transactions} />
            </div>

            <div className="lg:row-span-2">
              <TrackerWidget />
            </div>

            <div className="lg:col-span-2 lg:row-span-2">
              <AccountBalanceWidget />
            </div>

            <div className="lg:col-span-2">
              <SpendingWidget transactions={transactions} />
            </div>

            <div className="lg:row-span-2">
              <InboxWidget />
            </div>

            <div className="lg:col-span-2">
              <TransactionsWidget transactions={transactions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
