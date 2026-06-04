import { supabase } from '../lib/supabaseClient';

// Add a new expense
export async function addExpense(input) {
  const { data, error } = await supabase
    .from('expense') // changed here
    .insert([
      {
        user_id: input.user_id,
        title: input.title,
        amount: input.amount,
        type: input.type, // 'credit' or 'debit'
        category: input.category ?? null,
        expense_date: input.expense_date,
        description: input.description ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all expenses for a user (latest first)
export async function getExpenses(user_id) {
  const { data, error } = await supabase
    .from('expense') // changed here
    .select('*')
    .eq('user_id', user_id)
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Update an existing expense (only for this user)
export async function updateExpense(expense_id, user_id, updates) {
  const updateData = {};

  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.amount !== undefined) updateData.amount = updates.amount;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.category !== undefined) updateData.category = updates.category;
  if (updates.expense_date !== undefined) updateData.expense_date = updates.expense_date;
  if (updates.description !== undefined) updateData.description = updates.description;

  const { data, error } = await supabase
    .from('expense') // changed here
    .update(updateData)
    .eq('expense_id', expense_id)
    .eq('user_id', user_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete an expense (only for this user)
export async function deleteExpense(expense_id, user_id) {
  const { error } = await supabase
    .from('expense') // changed here
    .delete()
    .eq('expense_id', expense_id)
    .eq('user_id', user_id);

  if (error) throw error;
}

// Get expenses for a user with optional filters
// filters can have: { startDate, endDate, category }
export async function getExpensesWithFilters(user_id, filters = {}) {
  let query = supabase
    .from('expense')
    .select('*')
    .eq('user_id', user_id);   // never mix users

  if (filters.startDate) {
    query = query.gte('expense_date', filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte('expense_date', filters.endDate);
  }

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query
    .order('expense_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Calculate total expenses for a specific month (1-12) and year
export function getMonthlyTotal(expenses, year, month) {
  return expenses
    .filter((e) => {
      const d = new Date(e.expense_date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);
}

// Sum amount per category
export function groupByCategory(expenses) {
  const result = {};

  for (const e of expenses) {
    const cat = e.category || 'Uncategorized';
    if (!result[cat]) result[cat] = 0;
    result[cat] += Number(e.amount);
  }

  return result; // e.g. { Food: 1200, Travel: 800, Uncategorized: 300 }
}

// Sum amount per day (YYYY-MM-DD)
export function groupByDay(expenses) {
  const result = {};

  for (const e of expenses) {
    const day = e.expense_date; // already stored as date string
    if (!result[day]) result[day] = 0;
    result[day] += Number(e.amount);
  }

  return result;
}

// Sum amount per month (YYYY-MM)
export function groupByMonth(expenses) {
  const result = {};

  for (const e of expenses) {
    const d = new Date(e.expense_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!result[key]) result[key] = 0;
    result[key] += Number(e.amount);
  }

  return result;
}
