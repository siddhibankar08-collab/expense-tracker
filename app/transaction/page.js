"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image"; // Fixed: Added missing Image import
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Settings,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

export default function TransactionsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState("Monthly");
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState([]); // Fixed: Renamed to singular state

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        router.push("/login");
        return;
      }

      const { data: expenseRows, error } = await supabase
        .from("expense")
        .select("date, description, type, credit_amount, debit_amount")
        .order("id", { ascending: false });

      if (!error && expenseRows) {
        const mapped = expenseRows.map((row) => ({
          name: row.description || (row.type === "credit" ? "Income" : "Expense"),
          category: row.type === "credit" ? "Income" : "Expense Log",
          date: row.date || "N/A",
          type: row.type === "credit" ? "Income" : "Expense",
          amount:
            (row.type === "credit" ? "+" : "-") +
            "₹" +
            (row.type === "credit"
              ? row.credit_amount || 0
              : row.debit_amount || 0
            ).toLocaleString("en-IN"),
        }));
        setTransaction(mapped);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-neutral-400">
            Fetching ledger entries...
          </p>
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

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
            { icon: PieChart, label: "Analytics", path: "/analytics" },
            { icon: Receipt, label: "Transactions", path: "/transaction", active: true },
            { icon: Settings, label: "Settings", path: "/settings" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                item.active
                  ? "bg-white text-black font-semibold shadow-lg shadow-black/20"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon
                size={18}
                className={item.active ? "text-black" : "text-neutral-400 group-hover:text-white"}
              />
              <span className="text-sm">{item.label}</span>
              {item.active && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* TOP BAR */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Transactions Ledger
              </h1>
              <p className="text-neutral-400 text-xs mt-0.5">
                Track all structural income and expenses.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-[#121214] border border-neutral-800 rounded-xl px-3.5 py-2">
                <Search size={16} className="text-neutral-500" />
                <input
                  placeholder="Search transactions..."
                  className="bg-transparent outline-none ml-2.5 text-xs w-56 text-neutral-200"
                />
              </div>

              <button className="p-2.5 bg-[#121214] border border-neutral-800 rounded-xl text-neutral-400 hover:text-white">
                <Bell size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT INTERFACE */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* FILTERS TOOLBAR */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <select className="bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-2.5 pr-10 text-sm appearance-none outline-none text-neutral-300 cursor-pointer">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Year</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
              />
            </div>

            <div className="flex bg-[#1C1C1E] rounded-xl border border-neutral-800 p-1">
              {["Daily", "Weekly", "Monthly"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-5 py-2 text-sm rounded-lg transition-all duration-200 ${
                    viewMode === mode
                      ? "bg-white text-black font-medium"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* LEDGER DATA TABLE CARD */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-neutral-800">
              <h2 className="font-bold text-white text-lg tracking-tight">
                All Transactions
              </h2>
            </div>

            {transaction.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
                <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 mb-3">
                  <Receipt size={24} />
                </div>
                <p className="text-sm font-medium">No record entries available yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 text-xs uppercase tracking-wider bg-neutral-900/20">
                      <th className="px-6 py-4 font-semibold">Transaction</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="text-right px-6 py-4 font-semibold">Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-800/60 text-sm">
                    {transaction.map((txn, index) => {
                      const isIncome = txn.type === "Income";
                      return (
                        <tr
                          key={index}
                          className="hover:bg-neutral-900/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-neutral-200">
                            {txn.name}
                          </td>
                          <td className="px-6 py-4 text-neutral-400">
                            {txn.category}
                          </td>
                          <td className="px-6 py-4 text-neutral-400">
                            {txn.date}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                                isIncome
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                              }`}
                            >
                              {txn.type}
                            </span>
                          </td>
                          <td
                            className={`px-6 py-4 text-right font-bold tracking-tight ${
                              isIncome ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {txn.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}