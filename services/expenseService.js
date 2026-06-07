import { supabase } from "@/lib/supabaseClient"; // or your existing client


export async function addTransaction(input) {
  const amount = Number(input.amount);

  if (!amount || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  if (!input.user_id) {
    throw new Error("user_id is required");
  }

  if (!input.date) {
    throw new Error("date is required");
  }

  if (input.currentBalance == null) {
    throw new Error("currentBalance is required to compute new balance");
  }

  const isIncome = input.transactionType === "income";

  const credit_amount = isIncome ? amount : null;
  const debit_amount = isIncome ? null : amount;
  const type = isIncome ? "credit" : "debit";

  const newBalance = isIncome
    ? input.currentBalance + amount
    : input.currentBalance - amount;

  const { data, error } = await supabase
    .from("expense")
    .insert([
      {
        user_id: input.user_id,
        credit_amount,
        debit_amount,
        balance: newBalance,
        due_amount: input.due_amount ?? null,
        date: input.date,
        description: input.description ?? null,
        type,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLatestBalance() {
  const { data, error } = await supabase
    .from("expense")
    .select("balance")
    .order("id", { ascending: false }) // or "date" if that's better
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows, if you hit that you can treat balance as 0
    throw error;
  }

  return data ? data.balance : 0;
}

// --------------------------
// Update an existing transaction
// --------------------------
// updates can include: { credit_amount, debit_amount, balance, due_amount, date, description, type }
export async function updateExpense(expense_id, user_id, updates) {
  const updateData = {};

  if (updates.credit_amount !== undefined) {
    updateData.credit_amount = updates.credit_amount;
  }
  if (updates.debit_amount !== undefined) {
    updateData.debit_amount = updates.debit_amount;
  }
  if (updates.balance !== undefined) {
    updateData.balance = updates.balance;
  }
  if (updates.due_amount !== undefined) {
    updateData.due_amount = updates.due_amount;
  }
  if (updates.date !== undefined) {
    updateData.date = updates.date;
  }
  if (updates.description !== undefined) {
    updateData.description = updates.description;
  }
  if (updates.type !== undefined) {
    updateData.type = updates.type; // "credit" or "debit"
  }

  const { data, error } = await supabase
    .from("expense")
    .update(updateData)
    .eq("expense_id", expense_id)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --------------------------
// Delete a transaction
// --------------------------
export async function deleteExpense(expense_id, user_id) {
  const { error } = await supabase
    .from("expense")
    .delete()
    .eq("expense_id", expense_id)
    .eq("user_id", user_id);

  if (error) throw error;
}

// --------------------------
// Get expenses with filters
// filters: { startDate, endDate, type }   // type: "credit" or "debit"
// --------------------------
export async function getExpensesWithFilters(user_id, filters = {}) {
  let query = supabase
    .from("expense")
    .select("*")
    .eq("user_id", user_id);

  if (filters.startDate) {
    query = query.gte("date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("date", filters.endDate);
  }

  if (filters.type) {
    query = query.eq("type", filters.type); // "credit" or "debit"
  }

  const { data, error } = await query
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// --------------------------
// Aggregation helpers
// --------------------------

// Monthly totals (credit & debit) for given year and month (1-12)
export function getMonthlyTotals(expenses, year, month) {
  return expenses.reduce(
    (totals, e) => {
      const d = new Date(e.date);
      if (d.getFullYear() === year && d.getMonth() + 1 === month) {
        totals.totalCredit += Number(e.credit_amount || 0);
        totals.totalDebit += Number(e.debit_amount || 0);
      }
      return totals;
    },
    { totalCredit: 0, totalDebit: 0 }
  );
}

// Group by day: { "2026-06-01": { credit, debit } }
export function groupByDay(expenses) {
  const result = {};

  for (const e of expenses) {
    const day = e.date;
    if (!result[day]) {
      result[day] = { credit: 0, debit: 0 };
    }
    result[day].credit += Number(e.credit_amount || 0);
    result[day].debit += Number(e.debit_amount || 0);
  }

  return result;
}

// Group by month: { "2026-06": { credit, debit } }
export function groupByMonth(expenses) {
  const result = {};

  for (const e of expenses) {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

    if (!result[key]) {
      result[key] = { credit: 0, debit: 0 };
    }
    result[key].credit += Number(e.credit_amount || 0);
    result[key].debit += Number(e.debit_amount || 0);
  }

  return result;
}