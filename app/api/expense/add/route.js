import { NextResponse } from 'next/server';
import { addExpense } from '../../../../services/expenseService';

export async function POST(request) {
  try {
    const body = await request.json();
    // body must include: user_id, title, amount, type, expense_date
    // optional: category, description

    const expense = await addExpense(body);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error adding expense:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add expense' },
      { status: 500 }
    );
  }
}   