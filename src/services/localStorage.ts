import { fetchViaProxy } from './api';

const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN;
const BUDGET_API_URL = import.meta.env.VITE_NOCODB_BUDGET_URL;
const EXPENSES_API_URL = import.meta.env.VITE_NOCODB_EXPENSES_URL;
const EMAILS_API_URL = import.meta.env.VITE_NOCODB_EMAILS_URL;

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

const headers = {
  'xc-token': API_TOKEN,
  'Content-Type': 'application/json'
};

interface NocoDBListResponse<T> {
  list: T[];
}

export async function getBudgetConfig(): Promise<BudgetConfig | null> {
  try {
    const url = `${BUDGET_API_URL}?limit=1&sort=-Id`;
    const json = await fetchViaProxy(url) as NocoDBListResponse<BudgetConfig>;
    const records = json.list || [];

    if (records.length === 0) return null;

    return records[0];
  } catch (error) {
    console.error('Error fetching budget config:', error);
    return null;
  }
}

export async function updateBudget(budget: number): Promise<boolean> {
  try {
    const config = await getBudgetConfig();

    if (config && config.Id) {
      const response = await fetch(`${BUDGET_API_URL}/${config.Id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          monthly_budget: budget,
          updated_at: new Date().toISOString()
        })
      });
      return response.ok;
    } else {
      const response = await fetch(BUDGET_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          monthly_budget: budget,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });
      return response.ok;
    }
  } catch (error) {
    console.error('Error updating budget:', error);
    return false;
  }
}

export async function getExpenses(): Promise<Expense[]> {
  try {
    const url = `${EXPENSES_API_URL}?limit=1000&sort=-Id`;
    const json = await fetchViaProxy(url) as NocoDBListResponse<Expense>;
    return json.list || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

export async function addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<boolean> {
  try {
    const response = await fetch(EXPENSES_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        created_at: new Date().toISOString()
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error adding expense:', error);
    return false;
  }
}

export async function deleteExpense(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${EXPENSES_API_URL}/${id}`, {
      method: 'DELETE',
      headers
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
}

export async function getEmailAccounts(): Promise<EmailAccount[]> {
  try {
    const url = `${EMAILS_API_URL}?limit=1000&sort=-Id`;
    const json = await fetchViaProxy(url) as NocoDBListResponse<EmailAccount>;
    return json.list || [];
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

    const response = await fetch(EMAILS_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        name,
        is_active: true,
        created_at: new Date().toISOString()
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error adding email:', error);
    return false;
  }
}

export async function deleteEmailAccount(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${EMAILS_API_URL}/${id}`, {
      method: 'DELETE',
      headers
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting email:', error);
    return false;
  }
}

export async function toggleEmailAccount(id: string, isActive: boolean): Promise<boolean> {
  try {
    const response = await fetch(`${EMAILS_API_URL}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        is_active: isActive
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Error toggling email:', error);
    return false;
  }
}
