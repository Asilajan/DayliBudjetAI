import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export async function getBudgetConfig(): Promise<BudgetConfig | null> {
  const { data, error } = await supabase
    .from('budget_config')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching budget:', error);
    return null;
  }

  return data;
}

export async function updateBudget(budget: number): Promise<boolean> {
  const config = await getBudgetConfig();

  if (config) {
    const { error } = await supabase
      .from('budget_config')
      .update({ monthly_budget: budget, updated_at: new Date().toISOString() })
      .eq('id', config.id);

    if (error) {
      console.error('Error updating budget:', error);
      return false;
    }
  } else {
    const { error } = await supabase
      .from('budget_config')
      .insert({ monthly_budget: budget });

    if (error) {
      console.error('Error creating budget:', error);
      return false;
    }
  }

  return true;
}

export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }

  return data || [];
}

export async function addExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase
    .from('expenses')
    .insert(expense);

  if (error) {
    console.error('Error adding expense:', error);
    return false;
  }

  return true;
}

export async function deleteExpense(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting expense:', error);
    return false;
  }

  return true;
}

export async function getEmailAccounts(): Promise<EmailAccount[]> {
  const { data, error } = await supabase
    .from('email_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching emails:', error);
    return [];
  }

  return data || [];
}

export async function addEmailAccount(email: string, name: string): Promise<boolean> {
  const { error } = await supabase
    .from('email_accounts')
    .insert({ email, name, is_active: true });

  if (error) {
    console.error('Error adding email:', error);
    return false;
  }

  return true;
}

export async function deleteEmailAccount(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('email_accounts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting email:', error);
    return false;
  }

  return true;
}

export async function toggleEmailAccount(id: string, isActive: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('email_accounts')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) {
    console.error('Error toggling email:', error);
    return false;
  }

  return true;
}
