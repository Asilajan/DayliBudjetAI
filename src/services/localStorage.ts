export interface BudgetConfig {
  id: string;
  monthly_budget: number;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'courses' | 'factures';
  description: string;
  date: string;
  created_at: string;
}

export interface EmailAccount {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

const BUDGET_KEY = 'budget_config';
const EXPENSES_KEY = 'expenses';
const EMAILS_KEY = 'email_accounts';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function getBudgetConfig(): Promise<BudgetConfig | null> {
  const data = localStorage.getItem(BUDGET_KEY);
  if (!data) return null;
  return JSON.parse(data);
}

export async function updateBudget(budget: number): Promise<boolean> {
  try {
    const config = await getBudgetConfig();

    if (config) {
      config.monthly_budget = budget;
      config.updated_at = new Date().toISOString();
    } else {
      const newConfig: BudgetConfig = {
        id: generateId(),
        monthly_budget: budget,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localStorage.setItem(BUDGET_KEY, JSON.stringify(newConfig));
      return true;
    }

    localStorage.setItem(BUDGET_KEY, JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error updating budget:', error);
    return false;
  }
}

export async function getExpenses(): Promise<Expense[]> {
  try {
    const data = localStorage.getItem(EXPENSES_KEY);
    if (!data) return [];
    return JSON.parse(data);
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
      id: generateId(),
      created_at: new Date().toISOString()
    };
    expenses.push(newExpense);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    return true;
  } catch (error) {
    console.error('Error adding expense:', error);
    return false;
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    const expenses = await getExpenses();
    const filtered = expenses.filter(e => e.id !== id);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
}

export async function getEmailAccounts(): Promise<EmailAccount[]> {
  try {
    const data = localStorage.getItem(EMAILS_KEY);
    if (!data) return [];
    return JSON.parse(data);
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
      id: generateId(),
      email,
      name,
      is_active: true,
      created_at: new Date().toISOString()
    };
    emails.push(newEmail);
    localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
    return true;
  } catch (error) {
    console.error('Error adding email:', error);
    return false;
  }
}

export async function deleteEmailAccount(id: string): Promise<boolean> {
  try {
    const emails = await getEmailAccounts();
    const filtered = emails.filter(e => e.id !== id);
    localStorage.setItem(EMAILS_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting email:', error);
    return false;
  }
}

export async function toggleEmailAccount(id: string, isActive: boolean): Promise<boolean> {
  try {
    const emails = await getEmailAccounts();
    const email = emails.find(e => e.id === id);
    if (email) {
      email.is_active = isActive;
      localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error toggling email:', error);
    return false;
  }
}
