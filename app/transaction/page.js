"use client";

import { useState } from "react"; // Imported useState to handle button switching
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Settings,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

const transactions = [
  {
    name: "Salary Credit",
    category: "Income",
    date: "01 Jun 2026",
    type: "Income",
    amount: "+₹25,000",
  },
  {
    name: "Grocery Shopping",
    category: "Food",
    date: "04 Jun 2026",
    type: "Expense",
    amount: "-₹2,450",
  },
  {
    name: "Netflix Subscription",
    category: "Entertainment",
    date: "06 Jun 2026",
    type: "Expense",
    amount: "-₹499",
  },
  {
    name: "Freelance Payment",
    category: "Side Income",
    date: "08 Jun 2026",
    type: "Income",
    amount: "+₹8,000",
  },
  {
    name: "Fuel",
    category: "Transport",
    date: "10 Jun 2026",
    type: "Expense",
    amount: "-₹1,200",
  },
];

export default function TransactionsPage() {
  // Added state to track which view mode is currently active
  const [viewMode, setViewMode] = useState("Monthly");

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 font-sans antialiased flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] flex-col fixed h-full border-r border-neutral-800 shadow-xl z-20">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-white font-bold text-xl">S</span>
            </div>

            <div>
              <h1 className="font-bold text-xl text-[#04d292]">
                SpendWise
              </h1>
              <p className="text-[11px] text-neutral-400 uppercase">
                Personal Finance
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5">
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
          </button>

          <button className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5">
            <PieChart size={18} />
            <span className="text-sm">Analytics</span>
          </button>

          <button className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl bg-white text-black font-semibold">
            <Receipt size={18} />
            <span className="text-sm">Transactions</span>
          </button>

          <button className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* TOP BAR */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                Transactions
              </h1>

              <p className="text-neutral-400 text-xs mt-0.5">
                Track all income and expenses.
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

              <button className="p-2.5 bg-[#121214] border border-neutral-800 rounded-xl">
                <Bell size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* FILTERS */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-5 flex flex-wrap gap-3">
            <div className="relative">
              <select className="bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-2.5 pr-10 text-sm appearance-none">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>This Year</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-3 text-neutral-500"
              />
            </div>

            {/* DYNAMIC TOGGLE BUTTON GROUP */}
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

          {/* TABLE */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="p-6 border-b border-neutral-800">
              <h2 className="font-bold text-white text-lg">
                All Transactions
              </h2>
            </div>

            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                  <th className="text-left px-6 py-4">Transaction</th>
                  <th className="text-left px-6 py-4">Category</th>
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Type</th>
                  <th className="text-right px-6 py-4">Amount</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((txn, index) => (
                  <tr
                    key={index}
                    className="border-b border-neutral-800"
                  >
                    <td className="px-6 py-5 font-medium">
                      {txn.name}
                    </td>

                    <td className="px-6 py-5 text-neutral-400">
                      {txn.category}
                    </td>

                    <td className="px-6 py-5 text-neutral-400">
                      {txn.date}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          txn.type === "Income"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {txn.type}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-5 text-right font-bold ${
                        txn.type === "Income"
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
          </div>
        </div>
      </main>
    </div>
  );
}