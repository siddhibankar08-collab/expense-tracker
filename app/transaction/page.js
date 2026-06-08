"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Settings,
} from "lucide-react";
import Image from "next/image";

const transactions = [
  {
    purpose: "Salary Credit",
    category: "Income",
    date: "01 Jun 2026",
    time: "10:00 AM",
    type: "Income",
    amount: "+₹25,000",
  },
  {
    purpose: "Grocery Shopping",
    category: "Food",
    date: "04 Jun 2026",
    time: "03:45 PM",
    type: "Expense",
    amount: "-₹2,450",
  },
  {
    purpose: "Netflix Subscription",
    category: "Entertainment",
    date: "06 Jun 2026",
    time: "08:12 AM",
    type: "Expense",
    amount: "-₹499",
  },
  {
    purpose: "Freelance Payment",
    category: "Side Income",
    date: "08 Jun 2026",
    time: "11:30 AM",
    type: "Income",
    amount: "+₹8,000",
  },
  {
    purpose: "Fuel",
    category: "Transport",
    date: "10 Jun 2026",
    time: "06:20 PM",
    type: "Expense",
    amount: "-₹1,200",
  },
];

export default function TransactionsPage() {
  const router = useRouter();

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
          <button 
            onClick={() => router.push("/dashboard")} 
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 transition-all"
          >
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
          </button>

          <button 
            onClick={() => router.push("/analytics")} 
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 transition-all"
          >
            <PieChart size={18} />
            <span className="text-sm">Analytics</span>
          </button>

          <button 
            onClick={() => router.push("/transactions")} 
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl bg-white text-black font-semibold shadow-lg shadow-black/20"
          >
            <Receipt size={18} />
            <span className="text-sm">Transactions</span>
          </button>

          <button 
            onClick={() => router.push("/settings")} 
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 transition-all"
          >
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* TOP BAR */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              {/* MATCHED EXACTLY TO THE ANALYTICS PAGE FONT AND SIZE */}
              <h1 className="text-3xl font-black text-white">
                Transactions
              </h1>
              <p className="text-neutral-500 text-xs font-medium mt-1">
                Track all income and expenses.
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT */}
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
                    <th className="text-left px-8 py-4 w-[20%]">Date</th>
                    <th className="text-left px-8 py-4 w-[20%]">Time</th>
                    <th className="text-left px-8 py-4 w-[40%]">Purpose</th>
                    <th className="text-right px-8 py-4 w-[20%]">Credit/Debit</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((txn, index) => (
                    <tr
                      key={index}
                      className="border-b border-neutral-800 hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="px-8 py-5 text-neutral-300 text-base">
                        {txn.date}
                      </td>

                      <td className="px-8 py-5 text-neutral-300 text-base">
                        {txn.time}
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
                        className={`px-8 py-5 text-right font-black text-base ${
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
        </div>
      </main>
    </div>
  );
}