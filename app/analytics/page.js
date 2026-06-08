"use client";

import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Analytics() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);

      // 1. Check Auth User
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        router.push("/login");
        return;
      }

      // 2. Fetch User Profile Details
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();
      
      setUser(userData);

      // 3. Fetch Database Data for Calculations
      const { data: expenseRows, error } = await supabase
        .from("expense")
        .select("credit_amount, debit_amount, type, description")
        .order("id", { ascending: false });

      if (!error && expenseRows && expenseRows.length > 0) {
        let income = 0;
        let expenses = 0;
        const descriptionsMap = {};

        expenseRows.forEach((row) => {
          if (row.type === "credit") {
            income += row.credit_amount || 0;
          } else if (row.type === "debit") {
            expenses += row.debit_amount || 0;
            
            // Group expenses by description text to make a primitive breakdown category list
            const desc = row.description || "Other Expense";
            descriptionsMap[desc] = (descriptionsMap[desc] || 0) + (row.debit_amount || 0);
          }
        });

        setTotalIncome(income);
        setTotalExpenses(expenses);
        setNetSavings(income - expenses);

        const totalDenom = income || 1;
        setSavingsRate(Math.round(((income - expenses) / totalDenom) * 100));

        // Format grouped breakdown items into an array
        const sortedBreakdown = Object.entries(descriptionsMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // top 5 expenses

        setExpenseBreakdown(sortedBreakdown);
      }

      setLoading(false);
    };

    fetchAnalyticsData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-neutral-400">Loading metrics engine...</p>
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

        {/* Sidebar Nav (Now updated with Transactions route explicitly mapped) */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
            { icon: PieChart, label: "Analytics", path: "/analytics", active: true },
            { icon: Receipt, label: "Transactions", path: "/transaction" },
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
                className={item.active ? "text-black" : "text-neutral-400 group-hover:text-white transition-colors"}
              />
              <span className="text-sm">{item.label}</span>
              {item.active && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT WINDOW */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Financial Analytics</h1>
              <p className="text-neutral-400 text-xs mt-0.5">Deep-dive visual analysis of records.</p>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* DATA METRICS STRIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Gross Revenue</p>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <ArrowDownRight size={16} className="rotate-180" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">₹{totalIncome.toLocaleString("en-IN")}</h3>
            </div>

            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Burn Rate</p>
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">₹{totalExpenses.toLocaleString("en-IN")}</h3>
            </div>

            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Net Savings</p>
                <div className="p-2 bg-white/5 text-white rounded-xl">
                  <Wallet size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">₹{netSavings.toLocaleString("en-IN")}</h3>
            </div>
          </div>

          {/* VISUAL BREAKDOWN SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Savings Capacity Bar Chart Component */}
            <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-sm">
              <h3 className="font-bold text-white tracking-tight mb-1">Savings Performance</h3>
              <p className="text-xs text-neutral-400 mb-6">Ratio of retained income versus expenditures.</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-neutral-400">Target Efficiency Index</span>
                  <span className="text-white font-bold">{savingsRate}% Allocated</span>
                </div>
                <div className="w-full bg-neutral-800 h-4 rounded-full overflow-hidden p-0.5 border border-neutral-700">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, Math.min(savingsRate, 100))}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 bg-neutral-900/40 p-3 rounded-xl border border-neutral-800">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span>A higher metric represents a robust buffers portfolio setup.</span>
                </div>
              </div>
            </div>

            {/* Categorized Proportional Breakdown Lists */}
            <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-sm">
              <h3 className="font-bold text-white tracking-tight mb-1">Highest Cost Distributions</h3>
              <p className="text-xs text-neutral-400 mb-5">Top transactional volume centers mapped dynamically.</p>

              {expenseBreakdown.length === 0 ? (
                <p className="text-xs text-neutral-500 py-8 text-center border border-dashed border-neutral-800 rounded-xl">
                  No categorical debit logs parsed yet.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {expenseBreakdown.map((item, idx) => {
                    const percentage = totalExpenses > 0 ? Math.round((item.value / totalExpenses) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-neutral-300 truncate max-w-[200px]">{item.name}</span>
                          <span className="text-neutral-400 font-semibold">
                            ₹{item.value.toLocaleString("en-IN")} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500/60 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}