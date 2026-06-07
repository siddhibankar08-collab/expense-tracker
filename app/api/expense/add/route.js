import { NextResponse } from "next/server";
import { addTransaction } from "@/services/expenseService";

export async function POST(request) {
  try {
    const body = await request.json();

    const transaction = await addTransaction(body);

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error adding transaction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add transaction" },
      { status: 500 }
    );
  }
}