"use client";

import {
  LayoutDashboard,
  PieChart,
  Settings,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Receipt,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AnalyticsPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      // USER PROFILE DATA
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      setUser(userData);

      // LIVE EXPENSE ROWS FOR AUTHENTICATED USER
      const { data: expenseData, error } = await supabase
        .from("expense")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("date", { ascending: false });

      console.log("ANALYTICS DATA LOG:", expenseData);
      console.log("SUPABASE FETCH ERROR:", error);

      setExpenses(expenseData || []);
      setLoading(false);
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading metrics...</p>
        </div>
      </div>
    );
  }

  // AGGREGATIONS
  const credit = expenses.reduce((sum, e) => sum + Number(e.credit_amount || 0), 0);
  const debit = expenses.reduce((sum, e) => sum + Number(e.debit_amount || 0), 0);
  const balance = credit - debit;

  // RATIOS
  const total = credit + debit || 1;
  const creditPercent = Math.round((credit / total) * 100);
  const debitPercent = Math.round((debit / total) * 100);

  const healthScore =
    credit + debit > 0
      ? Math.min(100, Math.round((credit / (credit + debit)) * 100))
      : 0;

  const isHealthy = credit >= debit;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] flex-col fixed h-full border-r border-neutral-800 shadow-xl z-20">
        <div className="p-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
<div className="p-1.5 bg-black backdrop-blur-sm rounded-xl border border-[#04d292] shadow-sm flex items-center justify-center shrink-0">              <Image
                src="/images/spend.png"
                alt="SpendWise Logo"
                width={36}
                height={36}
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
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl bg-white text-black font-semibold shadow-lg shadow-black/20 text-left relative"
          >
            <PieChart size={18} className="text-black" />
            <span className="text-sm">Analytics</span>
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
          </button>

          <button 
            onClick={() => router.push("/transactions")} 
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all"
          >
            <Receipt size={18} />
            <span className="text-sm">Transactions</span>
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

      {/* MAIN CONTAINER */}
      <main className="flex-1 lg:ml-64">
        {/* HEADER */}
        
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* HERO HEALTH OVERVIEW CARD */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] rounded-2xl p-8 shadow-xl border border-neutral-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff05_0%,transparent_60%)]" />

            <p className="text-neutral-400 text-xs uppercase tracking-wider">
              Analytics Overview
            </p>

            <h2 className="text-4xl font-black mt-2">
              Financial Health Report
            </h2>

            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <TrendingUp size={14} />
              <span className="text-xs text-emerald-400">
                Generated on {expenses.length > 0 ? expenses[0].date : "-"}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-8">
              <div>
                <p className="text-xs text-neutral-500 uppercase">Credit Ratio</p>
                <h3 className="text-3xl font-bold text-emerald-400">{creditPercent}%</h3>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase">Debit Ratio</p>
                <h3 className="text-3xl font-bold text-rose-400">{debitPercent}%</h3>
              </div>
              <div>
                <p className="text-xs text-neutral-500 uppercase">Status</p>
                <h3 className="text-3xl font-bold">{isHealthy ? "Healthy" : "Attention"}</h3>
              </div>
            </div>
          </div>

          {/* KPI COUNTER METRICS GRID */}
          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800">
              <div className="flex justify-between mb-3">
                <p className="text-xs uppercase text-neutral-400">Total Credit</p>
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <ArrowDownRight size={16} className="rotate-180" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">₹{credit.toLocaleString("en-IN")}</h3>
            </div>

            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800">
              <div className="flex justify-between mb-3">
                <p className="text-xs uppercase text-neutral-400">Total Debit</p>
                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-400">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-bold">₹{debit.toLocaleString("en-IN")}</h3>
            </div>

            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800">
              <div className="flex justify-between mb-3">
                <p className="text-xs uppercase text-neutral-400">Net Saving</p>
                <div className="p-2 bg-white/5 rounded-xl text-neutral-400">
                  <Wallet size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-bold">₹{balance.toLocaleString("en-IN")}</h3>
            </div>
          </div>

          {/* FINANCIAL OVERVIEW AND PROGRESS COMPASS CARD BLOCK */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT CARD - OVERVIEW PROGRESS LINES */}
            <div className="lg:col-span-2 bg-[#121214] rounded-2xl p-6 border border-neutral-800">
              <h2 className="font-bold text-white mb-6">Financial Overview</h2>
              <div className="space-y-5">
                {[
                  { label: "Credit", value: credit, color: "bg-emerald-400" },
                  { label: "Debit", value: debit, color: "bg-rose-400" },
                  { label: "Balance", value: balance, color: "bg-white" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-300 font-medium">{item.label}</span>
                      <span className="font-semibold text-neutral-100">₹{item.value.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="h-3 bg-neutral-900 border border-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                        style={{
                          width: `${Math.min(
                            (Math.abs(item.value) / Math.max(credit, debit, Math.abs(balance), 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT CARD - PROGRESS TRACKER HEALTH BAR */}
            <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800">
              <h2 className="font-bold mb-5">Balance Health</h2>
              <div className="text-5xl font-black">{healthScore}%</div>
              <div className="mt-5 w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${healthScore}%` }}
                />
              </div>
              <p className="text-neutral-400 text-sm mt-4">
                {balance >= 0 ? "Strong liquidity position" : "Monitor spending pattern"}
              </p>
            </div>
          </div>

          {/* HISTORY DATA LOG LOGISTIC TABLE */}
          <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800">
            <h2 className="font-bold text-white">Analytics History</h2>
            <p className="text-xs text-neutral-400 mt-1 mb-5">Historical financial reports</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 text-left">
                    <th className="py-3">Date</th>
                    <th className="py-3">Description</th>
                    <th className="py-3">Credit</th>
                    <th className="py-3">Debit</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((row, idx) => (
                    <tr key={row.id || idx} className="border-b border-neutral-800 text-neutral-300">
                      <td className="py-4 whitespace-nowrap">{row.date || "N/A"}</td>
                      <td className="py-4 text-neutral-400 max-w-[220px] truncate">{row.description || "No description"}</td>
                      <td className="text-emerald-400 font-semibold">
                        {row.credit_amount ? `₹${Number(row.credit_amount).toLocaleString("en-IN")}` : "₹0"}
                      </td>
                      <td className="text-rose-400 font-semibold">
                        {row.debit_amount ? `₹${Number(row.debit_amount).toLocaleString("en-IN")}` : "₹0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {expenses.length === 0 && (
                <div className="text-center py-12 text-neutral-500 border border-dashed border-neutral-800 rounded-xl mt-4">
                  No personal transaction entries recorded.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}