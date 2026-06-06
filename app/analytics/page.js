"use client";

import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  Target,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Plus,
  X,
  FileText,
  ChevronDown,
  TrendingDown,
  Calendar,
  Layers,
  Award
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Workspace() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("Analytics");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("Expense");

  // Filter states for personal analytics
  const [timeRange, setTimeRange] = useState("Last 30 days");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [viewType, setViewType] = useState("Monthly");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (!existingUser) {
        await supabase.from("users").insert({
          user_id: authData.user.id,
          name: authData.user.email.split("@")[0],
          email: authData.user.email,
          user_type: "user",
        });
      }

      const { data: finalUser } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      setUser(finalUser);
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const transactions = [
    { name: "Netflix Subscription", date: "Today", amount: "-₹499", type: "expense" },
    { name: "Grocery Shopping", date: "Yesterday", amount: "-₹1,250", type: "expense" },
    { name: "Salary Credited", date: "1 Jun", amount: "+₹25,000", type: "income" },
    { name: "Uber Ride", date: "2 Jun", amount: "-₹350", type: "expense" },
  ];

  // Personal Finance Category-wise Data Mapping (Matches structure of your images)
  const categoryData = [
    { name: "Investments", income: "₹62,000", expense: "₹37,800", savings: "₹24,200", isPositive: true, trend: "up", height: "h-36", color: "bg-amber-500" },
    { name: "Salary / Bonus", income: "₹45,000", expense: "₹26,500", savings: "₹18,500", isPositive: true, trend: "up", height: "h-28", color: "bg-blue-500" },
    { name: "Food & Dining", income: "₹38,000", expense: "₹22,200", savings: "₹15,800", isPositive: true, trend: "down", height: "h-24", color: "bg-blue-500" },
    { name: "Shopping & Lifestyle", income: "₹28,000", expense: "₹16,000", savings: "₹12,000", isPositive: true, trend: "up", height: "h-20", color: "bg-blue-500" },
    { name: "Housing & Bills", income: "₹22,000", expense: "₹12,800", savings: "₹9,200", isPositive: true, trend: "up", height: "h-16", color: "bg-blue-500", highlighted: true },
    { name: "Leisure / Travel", income: "₹10,500", expense: "₹12,000", savings: "-₹1,500", isPositive: false, trend: "down", height: "h-3", color: "bg-rose-500" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-neutral-400">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 font-sans antialiased flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] flex-col fixed h-full border-r border-neutral-800 shadow-xl z-20">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shadow-md backdrop-blur-sm border border-white/10">
              <span className="text-white font-bold text-xl tracking-wider">S</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">SpendWise</h1>
              <p className="text-[11px] font-medium text-neutral-400 tracking-wider uppercase">Personal Finance</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: PieChart, label: "Analytics" },
          ].map((item, idx) => {
            const isActive = currentTab === item.label;
            return (
              <button
                key={idx}
                onClick={() => setCurrentTab(item.label)}
                className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-white text-black font-semibold shadow-lg shadow-black/20"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-black" : "text-neutral-400 group-hover:text-white transition-colors"} />
                <span className="text-sm">{item.label}</span>
                {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* TOP BAR */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {currentTab === "Dashboard" ? `${greeting}, ${user?.name || user?.email?.split("@")[0] || "User"} 👋` : "Analytics & Reports"}
              </h1>
              <p className="text-neutral-400 text-xs mt-0.5">
                {currentTab === "Dashboard" ? "Your financial snapshot is up to date." : "Compare asset allocation and track personal trends over time."}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-[#121214] border border-neutral-800 rounded-xl px-3.5 py-2 transition-all focus-within:border-neutral-700 focus-within:bg-black focus-within:ring-2 focus-within:ring-white/5">
                <Search size={16} className="text-neutral-500" />
                <input
                  placeholder="Search records..."
                  className="bg-transparent outline-none ml-2.5 text-xs w-56 text-neutral-200 placeholder-neutral-500"
                />
              </div>
              <button className="p-2.5 bg-[#121214] border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-300 relative transition-all active:scale-95">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full border-2 border-[#121214]" />
              </button>
              <div className="h-8 w-px bg-neutral-800 hidden md:block" />
              <div className="flex items-center gap-3 pl-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#121214] border border-neutral-700 flex items-center justify-center font-semibold text-white text-sm shadow-md">
                  A
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-neutral-200 leading-tight">Aarya</p>
                  <p className="text-[10px] text-neutral-500">Premium Account</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONDITIONALLY RENDERED SCENE VIEWS */}
        {currentTab === "Dashboard" ? (
          /* =======================================
             DASHBOARD SCREEN VIEW 
             ======================================= */
          <div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
            {/* HERO CARD */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] rounded-2xl p-8 shadow-xl border border-neutral-800 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff05_0%,transparent_60%)] pointer-events-none" />
              <p className="text-neutral-400 text-xs font-medium tracking-wider uppercase mb-1.5">Available Balance</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">₹52,300</h2>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium mb-6 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full border border-emerald-500/20">
                <TrendingUp size={14} />
                <span>+12.4% from last month</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="px-5 py-2.5 bg-white text-black text-xs font-semibold rounded-xl hover:bg-neutral-100 transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  Add Transaction
                </button>
              </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Total Income</p>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl"><ArrowDownRight size={16} className="rotate-180" /></div>
                </div>
                <h3 className="text-2xl font-bold text-white">₹18,000</h3>
                <p className="text-emerald-400 text-xs font-semibold mt-1.5 flex items-center gap-0.5">
                  +8.1% <span className="text-neutral-500 font-normal">vs last month</span>
                </p>
              </div>

              <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Total Expenses</p>
                  <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl"><ArrowUpRight size={16} /></div>
                </div>
                <h3 className="text-2xl font-bold text-white">₹12,450</h3>
                <p className="text-rose-400 text-xs font-semibold mt-1.5 flex items-center gap-0.5">
                  +3.4% <span className="text-neutral-500 font-normal">vs last month</span>
                </p>
              </div>

              <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">Net Savings</p>
                  <div className="p-2 bg-white/5 text-white rounded-xl"><Wallet size={16} /></div>
                </div>
                <h3 className="text-2xl font-bold text-white">₹5,550</h3>
                <div className="mt-2 w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: "27%" }}></div>
                </div>
                <p className="text-neutral-400 text-[11px] font-medium mt-1.5">
                  27% Savings rate achieved
                </p>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-white tracking-tight">Recent Activity</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">Your latest logs and settlements</p>
                </div>
                <button className="text-xs font-semibold text-white hover:bg-white/10 bg-white/5 px-3 py-1.5 rounded-lg border border-neutral-800 transition-colors">
                  View All
                </button>
              </div>

              <div className="divide-y divide-neutral-800">
                {transactions.map((txn, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 group transition-all">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        txn.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {txn.type === 'income' ? <ArrowDownRight size={18} className="rotate-180" /> : <Receipt size={18} />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-neutral-200 group-hover:text-white transition-colors">{txn.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{txn.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm tracking-tight ${
                      txn.amount.startsWith('+') ? 'text-emerald-400' : 'text-neutral-200'
                    }`}>
                      {txn.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* =======================================
             ANALYTICS SCREEN VIEW (PERSONALIZED)
             ======================================= */
          <div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
            
            {/* UPPER FILTERS LINE BAR */}
            <div className="flex flex-wrap items-center gap-3 bg-[#121214] p-4 rounded-2xl border border-neutral-800 shadow-sm">
              <div className="relative">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-[#1C1C1E] border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-neutral-200 outline-none appearance-none cursor-pointer focus:border-neutral-700"
                >
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>This Year</option>
                </select>
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>

              <div className="relative">
                <select 
                  value={categoryFilter} 
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#1C1C1E] border border-neutral-800 rounded-xl pl-9 pr-8 py-2 text-xs font-medium text-neutral-200 outline-none appearance-none cursor-pointer focus:border-neutral-700"
                >
                  <option>All Categories</option>
                  <option>Investments</option>
                  <option>Food & Dining</option>
                  <option>Housing & Bills</option>
                </select>
                <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>

              <div className="h-6 w-px bg-neutral-800 mx-1 hidden sm:block" />

              {/* View Selection switch controls */}
              <div className="flex p-1 bg-[#1C1C1E] rounded-xl border border-neutral-800 ml-auto sm:ml-0">
                {["Daily", "Weekly", "Monthly"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      viewType === type
                        ? "bg-white text-black shadow-sm"
                        : "text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN PERFORMANCE BLOCKS WRAPPER */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
              
              {/* TABLE COMPONENT: Category-wise Profit & Loss */}
              <div className="xl:col-span-2 bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-sm overflow-hidden">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-white tracking-tight">Category-wise Net Flow</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Performance margins broken down across personal streams</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-neutral-300">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-500 font-medium pb-2">
                        <th className="pb-3 font-semibold uppercase tracking-wider">Category</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-right">Total Inflow</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-right">Total Outflow</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-right">Net Savings</th>
                        <th className="pb-3 font-semibold uppercase tracking-wider text-center w-20">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-medium">
                      {categoryData.map((category, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 text-neutral-200 font-semibold flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${category.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            {category.name}
                          </td>
                          <td className="py-4 text-right text-emerald-400">{category.income}</td>
                          <td className="py-4 text-right text-rose-400">{category.expense}</td>
                          <td className={`py-4 text-right font-bold ${category.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {category.savings}
                          </td>
                          <td className="py-4 text-center">
                            <div className="flex justify-center">
                              {category.trend === "up" ? (
                                <span className="p-1 rounded bg-emerald-500/10 text-emerald-400"><TrendingUp size={14} /></span>
                              ) : (
                                <span className="p-1 rounded bg-rose-500/10 text-rose-400"><TrendingDown size={14} /></span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* VISUAL CHART COMPONENT: Category Breakdown */}
              <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-white tracking-tight">Category Comparison</h2>
                    <div className="flex items-center gap-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-1 rounded-lg">
                      <Award size={12} />
                      <span className="font-semibold">Investments — Top Stream</span>
                    </div>
                  </div>

                  {/* Tailwind Rendered Bar Graph Column Elements */}
                  <div className="relative pt-4 pb-2 px-2 border-b border-l border-neutral-800 min-h-[220px] flex items-end justify-between gap-2">
                    
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-4 pl-1">
                      <div className="w-full border-t border-dashed border-neutral-600 w-full" />
                      <div className="w-full border-t border-dashed border-neutral-600 w-full" />
                      <div className="w-full border-t border-dashed border-neutral-600 w-full" />
                    </div>

                    {categoryData.map((cat, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                        
                        {cat.highlighted && (
                          <div className="absolute -inset-x-1 -top-4 bottom-0 bg-neutral-800/40 border border-neutral-700/50 rounded-lg pointer-events-none -z-10" />
                        )}

                        {/* Interactive Floating Tooltip element */}
                        <div className={`absolute bottom-full mb-2 bg-white text-black text-[10px] font-bold p-2 rounded-xl shadow-xl border border-neutral-200 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30 transform translate-y-1 group-hover:translate-y-0 ${cat.highlighted ? 'opacity-100' : ''}`}>
                          <p className="text-neutral-500 font-medium">{cat.name}</p>
                          <p className="text-neutral-900 mt-0.5">Net: <span className={cat.isPositive ? 'text-emerald-600':'text-rose-600'}>{cat.savings}</span></p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-white" />
                        </div>

                        <div className={`w-full max-w-[28px] ${cat.height} ${cat.color} rounded-t-md transition-all duration-300 shadow-md group-hover:brightness-110`} />

                        <span className="text-[9px] text-neutral-500 mt-2 font-medium truncate max-w-full block">
                          {cat.name.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-[9px] text-neutral-600 mt-1 font-mono">
                    <span>₹ 0.0k</span>
                    <span>₹ 25.0k</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 mt-6">
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Data updates dynamically based on processed items. Hover columns to inspect explicit value mappings.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* TRANSACTION MODAL */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#121214] w-full max-w-md rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden transform scale-100 transition-transform">
            <div className="px-6 py-4 bg-[#1C1C1E] border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-neutral-400" />
                Add Transaction
              </h2>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Transaction Type
                </label>
                <div className="relative">
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all text-neutral-200 appearance-none cursor-pointer"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-[#1C1C1E] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 rounded-xl pl-8 pr-4 py-2.5 text-sm font-semibold outline-none transition-all text-white placeholder-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full bg-[#1C1C1E] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all text-neutral-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  rows={2.5}
                  placeholder="What was this item or event for?..."
                  className="w-full bg-[#1C1C1E] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none placeholder-neutral-600 text-neutral-200"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 ${
                  transactionType === "Expense"
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-950/20"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/20"
                }`}
              >
                Save {transactionType}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}