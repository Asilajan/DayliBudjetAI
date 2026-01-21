const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface BudgetConfig {
  Id?: number;
  id?: string;
  monthly_budget: number;
  created_at?: string;
  CreatedAt?: string;
  updated_at?: string;
  UpdatedAt?: string;
}

export interface Expense {
  Id?: number;
  id?: string;
  amount: number;
  category: 'courses' | 'factures';
  description: string;
  date: string;
  created_at?: string;
  CreatedAt?: string;
}

export interface EmailAccount {
  Id?: number;
  id?: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  CreatedAt?: string;
}

const STORAGE_KEYS = {
  BUDGET: 'home_budget_config',
  EXPENSES: 'home_expenses',
  EMAILS: 'home_emails'
};

export async function getBudgetConfig(): Promise<BudgetConfig | null> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (stored) {
      return JSON.parse(stored);
    }
    return { monthly_budget: 800 };
  } catch (error) {
    console.error('Error fetching budget config:', error);
    return { monthly_budget: 800 };
  }
}

export async function updateBudget(budget: number): Promise<boolean> {
  try {
    const config: BudgetConfig = {
      monthly_budget: budget,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error updating budget:', error);
    return false;
  }
}

export async function getExpenses(): Promise<Expense[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

export async function addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const expenses = await getExpenses();
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return true;
  } catch (error) {
    console.error('Error adding expense:', error);
    return false;
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    const expenses = await getExpenses();
    const filtered = expenses.filter(e => e.id !== id && String(e.Id) !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
}

export async function getEmailAccounts(): Promise<EmailAccount[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EMAILS);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
}

export async function addEmailAccount(email: string, name: string): Promise<boolean> {
  try {
    const emails = await getEmailAccounts();

    if (emails.some(e => e.email === email)) {
      return false;
    }

    const newEmail: EmailAccount = {
      id: Date.now().toString(),
      email,
      name,
      is_active: true,
      created_at: new Date().toISOString()
    };
    emails.push(newEmail);
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(emails));
    return true;
  } catch (error) {
    console.error('Error adding email:', error);
    return false;
  }
}

export async function deleteEmailAccount(id: string): Promise<boolean> {
  try {
    const emails = await getEmailAccounts();
    const filtered = emails.filter(e => e.id !== id && String(e.Id) !== id);
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting email:', error);
    return false;
  }
}

export async function toggleEmailAccount(id: string, isActive: boolean): Promise<boolean> {
  try {
    const emails = await getEmailAccounts();
    const updated = emails.map(e => {
      if (e.id === id || String(e.Id) === id) {
        return { ...e, is_active: isActive };
      }
      return e;
    });
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error toggling email:', error);
    return false;
  }
}
