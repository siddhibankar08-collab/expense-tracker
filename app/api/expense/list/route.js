import { NextResponse } from 'next/server';
import { getExpensesWithFilters } from '../../../../services/expenseService';

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, startDate, endDate, category } = body;

    const expenses = await getExpensesWithFilters(user_id, {
      startDate,
      endDate,
      category,
    });

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}