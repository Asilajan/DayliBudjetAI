import { InsightsWidget } from './components/InsightsWidget';
import { TrackerWidget } from './components/TrackerWidget';
import { AccountBalanceWidget } from './components/AccountBalanceWidget';
import { SpendingWidget } from './components/SpendingWidget';
import { TransactionsWidget } from './components/TransactionsWidget';
import { InboxWidget } from './components/InboxWidget';

function App() {
  return (
    <div className="min-h-screen bg-[#000000] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Dashboard</h1>
          <p className="text-[#a1a1a1]">Track your finances in real-time</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          <div className="lg:col-span-2">
            <InsightsWidget />
          </div>

          <div className="lg:row-span-2">
            <TrackerWidget />
          </div>

          <div className="lg:col-span-2 lg:row-span-2">
            <AccountBalanceWidget />
          </div>

          <div className="lg:col-span-2">
            <SpendingWidget />
          </div>

          <div className="lg:row-span-2">
            <InboxWidget />
          </div>

          <div className="lg:col-span-2">
            <TransactionsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
