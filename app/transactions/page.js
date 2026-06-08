"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function TransactionsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      // 1. FETCH USER PROFILE DATA
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      setUser(userData);

      let query = supabase
        .from("expense")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (!showAll) {
        query = query.limit(10);
      }

      const { data: dbRows, error } = await query;

      if (!error && dbRows) {
        // Map database columns to the component structure safely
        const mappedRows = dbRows.map((row) => {
          // Normalize type checking to handle case variants securely
          const normalizedType = String(row.type || "").toLowerCase();
          const isIncome = normalizedType === "credit" || normalizedType === "income";

          // Fallback parsing logic to make sure amounts never show up as NaN
          const rawAmount = isIncome ? (row.credit_amount || 0) : (row.debit_amount || 0);
          const currentRunningBalance = row.balance || 0;

          return {
            id: row.expense_id || row.id,
            date: row.date || "N/A",
            // We can show the running balance snapshot calculated by your submit form here
            balanceSnapshot: `₹${Number(currentRunningBalance).toLocaleString("en-IN")}`,
            purpose: row.description || (isIncome ? "Income Log" : "Expense Log"),
            category: row.category || (isIncome ? "Income" : "Expense"),
            type: isIncome ? "Income" : "Expense",
            amount: `${isIncome ? "+" : "-"}₹${Number(rawAmount).toLocaleString("en-IN")}`,
          };
        });

        setTransactions(mappedRows);
      }

      setLoading(false);
    };

    fetchTransactions();
  }, [router, showAll]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading ledger data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 font-sans antialiased flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] flex-col fixed h-full border-r border-neutral-800 shadow-xl z-20">
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/5 backdrop-blur-sm rounded-xl border border-emerald-500/20 shadow-sm flex items-center justify-center shrink-0">
              <Image
                src="/images/spendwiselogo.png"
                alt="SpendWise Logo"
                width={36}
                height={36}
                className="object-contain invert sepia-emerald hue-rotate-60 brightness-125"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#04d292] tracking-tight leading-tight">
                SpendWise
              </h1>
              <p className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase">
                Personal Finance
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 flex flex-col h-[calc(100%-80px)]">           <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all"
        >
          <LayoutDashboard size={18} />
          <span className="text-sm">Dashboard</span>
        </button>

          <button
            onClick={() => router.push("/analytics")}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all"
          >
            <PieChart size={18} />
            <span className="text-sm">Analytics</span>
          </button>

          <button
            onClick={() => router.push("/transactions")}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl bg-white text-black font-semibold shadow-lg shadow-black/20 text-left relative"
          >
            <Receipt size={18} className="text-black" />
            <span className="text-sm">Transactions</span>
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
          </button>

          <button
            onClick={() => router.push("/settings")}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all"
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
          {/* LOWER PROFILE BOX (BLACKISH-GREY WITH EMERALD ACCENTS) */}
          <button
            onClick={() => router.push("/settings")}
            className="w-full mt-auto flex items-center gap-3 p-3 rounded-xl bg-[#161618] hover:bg-[#1c1c1e] border border-[#04d292]/30 hover:border-[#04d292]/60 transition-all text-left group active:scale-95 shadow-md shadow-[#04d292]/5"
          >
            {/* Emerald tinted avatar icon */}
            <div className="w-9 h-9 rounded-xl bg-[#04d292]/10 border border-[#04d292]/30 group-hover:border-[#04d292]/50 transition-colors flex items-center justify-center font-bold text-[#04d292] text-sm shrink-0 shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-neutral-200 leading-tight group-hover:text-white transition-colors truncate">
                {user?.name || "User Profile"}
              </p>
              <p className="text-[10px] text-[#04d292] font-medium opacity-80 truncate mt-0.5">
                {user?.email || "Premium Member"}
              </p>
            </div>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* TOP BAR */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">
                Transactions
              </h1>
              <p className="text-neutral-500 text-xs font-medium mt-1">
                Track all income and expenses.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#121214] border border-neutral-700 flex items-center justify-center font-semibold text-white text-sm shadow-md select-none">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT VIEW */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TABLE CONTAINER */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-6 border-b border-neutral-800">
              <h2 className="font-bold text-white text-lg">
                All Transactions
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[700px]">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                    <th className="text-left px-8 py-4 w-[25%]">Date</th>
                    <th className="text-left px-8 py-4 w-[20%]">Running Balance</th>
                    <th className="text-left px-8 py-4 w-[35%]">Purpose</th>
                    <th className="text-right px-8 py-4 w-[20%]">Credit/Debit</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-neutral-800 hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-8 py-5 text-neutral-300 text-base">
                        {txn.date}
                      </td>

                      <td className="px-8 py-5 text-neutral-500 text-sm font-medium">
                        {txn.balanceSnapshot}
                      </td>

                      <td className="px-8 py-5 font-bold text-white text-base">
                        <div className="flex flex-col">
                          <span className="truncate">{txn.purpose}</span>
                          <span className="text-xs text-neutral-500 font-normal mt-0.5">
                            {txn.category}
                          </span>
                        </div>
                      </td>

                      <td
                        className={`px-8 py-5 text-right font-black text-base ${txn.type === "Income"
                          ? "text-emerald-400"
                          : "text-rose-400"
                          }`}
                      >
                        {txn.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {!showAll && transactions.length === 10 && (
                <div className="flex justify-center py-6">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                  >
                    Show All Transactions
                  </button>
                </div>
              )}

              {transactions.length === 0 && (
                <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-b-2xl">
                  No personal transaction data found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}