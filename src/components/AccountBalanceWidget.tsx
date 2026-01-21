import { motion } from 'framer-motion';
import { Wallet, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBudgetConfig, updateBudget, getExpenses, addExpense, deleteExpense, type Expense } from '../services/supabase';

type TabType = 'courses' | 'factures';

export function AccountBalanceWidget() {
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const [budget, setBudget] = useState(800);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState('800');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseDescription, setNewExpenseDescription] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const budgetConfig = await getBudgetConfig();
    if (budgetConfig) {
      setBudget(budgetConfig.monthly_budget);
      setNewBudget(budgetConfig.monthly_budget.toString());
    }

    const expensesData = await getExpenses();
    setExpenses(expensesData);
  }

  async function handleUpdateBudget() {
    const budgetValue = parseFloat(newBudget);
    if (!isNaN(budgetValue) && budgetValue > 0) {
      const success = await updateBudget(budgetValue);
      if (success) {
        setBudget(budgetValue);
        setIsEditingBudget(false);
      }
    }
  }

  async function handleAddExpense() {
    const amount = parseFloat(newExpenseAmount);
    if (!isNaN(amount) && amount > 0 && newExpenseDescription.trim()) {
      const success = await addExpense({
        amount,
        category: activeTab,
        description: newExpenseDescription.trim(),
        date: new Date().toISOString().split('T')[0]
      });

      if (success) {
        await loadData();
        setNewExpenseAmount('');
        setNewExpenseDescription('');
        setIsAddingExpense(false);
      }
    }
  }

  async function handleDeleteExpense(id: string) {
    const success = await deleteExpense(id);
    if (success) {
      await loadData();
    }
  }

  const filteredExpenses = expenses.filter(e => e.category === activeTab);
  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - expenses.reduce((sum, e) => sum + e.amount, 0);
  const percentage = (expenses.reduce((sum, e) => sum + e.amount, 0) / budget) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#09090b] border border-[#1f1f1f] rounded-2xl p-6 hover:border-[#2f2f2f] transition-colors"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-white" />
          <h2 className="text-white font-medium">Solde des comptes</h2>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#a1a1a1]">Budget mensuel</span>
          {!isEditingBudget ? (
            <button
              onClick={() => setIsEditingBudget(true)}
              className="flex items-center gap-1 text-sm text-white hover:text-[#3b82f6] transition-colors"
            >
              <span className="font-semibold">{budget.toFixed(2)} €</span>
              <Edit2 className="w-3 h-3" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-24 bg-[#0a0a0a] border border-[#2f2f2f] rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#3b82f6]"
                autoFocus
              />
              <button
                onClick={handleUpdateBudget}
                className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
              >
                <Check className="w-4 h-4 text-green-500" />
              </button>
              <button
                onClick={() => {
                  setIsEditingBudget(false);
                  setNewBudget(budget.toString());
                }}
                className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}
        </div>

        <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full"
            style={{
              backgroundColor: percentage > 90 ? '#ef4444' : percentage > 70 ? '#f97316' : '#22c55e'
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-[#6f6f6f]">
            Dépensé: {expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} €
          </span>
          <span className="text-xs text-[#6f6f6f]">
            Reste: {remaining.toFixed(2)} €
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'courses'
              ? 'bg-[#3b82f6] text-white'
              : 'bg-[#1a1a1a] text-[#a1a1a1] hover:bg-[#2a2a2a]'
          }`}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab('factures')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'factures'
              ? 'bg-[#3b82f6] text-white'
              : 'bg-[#1a1a1a] text-[#a1a1a1] hover:bg-[#2a2a2a]'
          }`}
        >
          Factures
        </button>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-[#a1a1a1]">
          Total {activeTab}: {totalSpent.toFixed(2)} €
        </span>
        <button
          onClick={() => setIsAddingExpense(true)}
          className="flex items-center gap-1 px-3 py-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs rounded-lg transition-colors"
        >
          <Plus className="w-3 h-3" />
          Ajouter
        </button>
      </div>

      {isAddingExpense && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-[#0a0a0a] border border-[#2f2f2f] rounded-lg"
        >
          <input
            type="text"
            placeholder="Description"
            value={newExpenseDescription}
            onChange={(e) => setNewExpenseDescription(e.target.value)}
            className="w-full mb-2 bg-[#1a1a1a] border border-[#2f2f2f] rounded px-3 py-2 text-sm text-white placeholder-[#6f6f6f] focus:outline-none focus:border-[#3b82f6]"
          />
          <input
            type="number"
            placeholder="Montant (€)"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            className="w-full mb-3 bg-[#1a1a1a] border border-[#2f2f2f] rounded px-3 py-2 text-sm text-white placeholder-[#6f6f6f] focus:outline-none focus:border-[#3b82f6]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddExpense}
              className="flex-1 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm rounded transition-colors"
            >
              Ajouter
            </button>
            <button
              onClick={() => {
                setIsAddingExpense(false);
                setNewExpenseAmount('');
                setNewExpenseDescription('');
              }}
              className="flex-1 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-sm rounded transition-colors"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-8 text-[#6f6f6f] text-sm">
            Aucune dépense dans cette catégorie
          </div>
        ) : (
          filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#0f0f0f] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{expense.description}</div>
                <div className="text-xs text-[#6f6f6f]">
                  {new Date(expense.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">
                  {expense.amount.toFixed(2)} €
                </span>
                <button
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="p-1 hover:bg-[#1a1a1a] rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
