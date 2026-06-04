import { supabase } from '../lib/supabaseClient';

// This type will be adjusted once we know the exact table columns
export type Expense = {
  id: number;              // maybe expense_id instead – we’ll confirm
  title: string;
  amount: number;
  category: string;
  expense_date: string;
  user_id: string;
  created_at?: string;
};

// Temporary function we’ll use later to test DB connection
export async function testExpensesConnection(user_id: string) {
  const { data, error } = await supabase
    .from('expenses')      // table name will be confirmed
    .select('*')
    .eq('user_id', user_id)
    .limit(1);

  if (error) throw error;
  return data;
}