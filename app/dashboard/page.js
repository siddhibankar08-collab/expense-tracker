"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  PieChart,
  Eye,
  EyeOff,
  Receipt,
  Settings,
  Plus,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();

  // Core App States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [metrics, setMetrics] = useState({
    balance: 0, 
    totalIncome: 0,
    totalExpenses: 0,
  });

  // Modal Interactive States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("Income"); 
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); 
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAmounts, setShowAmounts] = useState(true);
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      // Fetch Profile
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      setUser(userData);

      // Fetch Transaction Rows
      const { data: expenseData, error } = await supabase
        .from("expense")
        .select("*")
        .eq("user_id", authData.user.id)
        .order("created_at", { ascending: false });

      if (!error && expenseData) {
        setRecentActivity(expenseData);

        const incomeSum = expenseData.reduce((sum, item) => sum + Number(item.credit_amount || 0), 0);
        const expenseSum = expenseData.reduce((sum, item) => sum + Number(item.debit_amount || 0), 0);
        
        const currentRunningBalance = expenseData.length > 0 
          ? Number(expenseData[0].balance || 0) 
          : 0;

        setMetrics({
          balance: currentRunningBalance,
          totalIncome: incomeSum,
          totalExpenses: expenseSum,
        });
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [router]);

  // Handle Form Submission
  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      const numericAmount = Number(amount);
      if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error("Please enter a valid amount");
      }
      if (!date) throw new Error("Please select a date");
      const finalDescription = notes.trim() || "-";

      const backendType = transactionType.toLowerCase() === "income" ? "credit" : "debit";
      const currentRunningBalance = Number(metrics.balance || 0);
      const computedNewBalance = backendType === "credit"
        ? currentRunningBalance + numericAmount
        : currentRunningBalance - numericAmount;

      const payload = {
  user_id: user.user_id,
  type: backendType,
  date: date,
  description: finalDescription, //  Updated here
  credit_amount: backendType === "credit" ? numericAmount : null,
  debit_amount: backendType === "debit" ? numericAmount : null,
  balance: computedNewBalance,
  due_amount: null,
};

      const { error } = await supabase.from("expense").insert([payload]);

      if (error) throw error;

      setMetrics((prev) => ({
        ...prev,
        balance: computedNewBalance,
        totalIncome: backendType === "credit" ? prev.totalIncome + numericAmount : prev.totalIncome,
        totalExpenses: backendType === "debit" ? prev.totalExpenses + numericAmount : prev.totalExpenses,
      }));

      setRecentActivity((prev) => [payload, ...prev]);
      setAmount("");
      setNotes("");
      setIsModalOpen(false);
      router.refresh();

    } catch (err) {
      console.error(err);
      setFormError(err.message || "Failed to submit transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-zinc-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-zinc-600 font-medium">Loading your profile snapshot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black  text-zinc-900 flex relative">
      
      {/* SIDEBAR (SOFT LIGHT BLACK / CHARCOAL) */}
{/* SIDEBAR (RICH BLACK) */}
<aside className="hidden lg:flex w-64 bg-[#0A0A0C] flex-col fixed h-full border-r border-neutral-900 shadow-xl z-20">        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-zinc-950 rounded-xl border border-[#04d292] shadow-sm flex items-center justify-center shrink-0">
              <Image
                src="/images/spend.png"
                alt="SpendWise Logo"
                width={36}
                height={36}
              />
            </div>
            <div>
              <h1 className="text-emerald-400 text-xl font-black tracking-tight leading-none">
                Spend<span className="text-emerald">Wise</span>
              </h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 flex flex-col h-[calc(100%-80px)]">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl bg-white text-zinc-950 font-semibold shadow-lg text-left relative">
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-zinc-950" />
          </button>
          <button onClick={() => router.push("/analytics")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 text-left transition-all">
            <PieChart size={18} />
            <span className="text-sm">Analytics</span>
          </button>
          <button onClick={() => router.push("/transactions")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 text-left transition-all">
            <Receipt size={18} />
            <span className="text-sm">Transactions</span>
          </button>
          <button onClick={() => router.push("/settings")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 text-left transition-all">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>

          {/* LOWER PROFILE BOX */}
          <button
            onClick={() => router.push("/settings")}
            className="w-full mt-auto flex items-center gap-3 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-[#04d292]/30 hover:border-[#04d292]/60 transition-all text-left group active:scale-95 shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-[#04d292]/10 border border-[#04d292]/30 group-hover:border-[#04d292]/50 transition-colors flex items-center justify-center font-bold text-[#04d292] text-sm shrink-0">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-zinc-200 leading-tight group-hover:text-white transition-colors truncate">
                {user?.name || "User Profile"}
              </p>
              <p className="text-[10px] text-[#04d292] font-medium opacity-80 truncate mt-0.5">
                {user?.email || "Premium Member"}
              </p>
            </div>
          </button>
        </nav>
      </aside>
      
      {/* MAIN CONTAINER (WHITE BACKGROUND) */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* HEADER */}
        {/* <header className="bg-white/80 backdrop-blur-md border-b border-zinc-200 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-zinc-900">Good Afternoon, {user?.name || "User"} 👋</h1>
            <p className="text-zinc-500 text-xs font-medium mt-0.5">Your financial snapshot is up to date.</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-semibold text-white text-sm">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
        </header> */}

        {/* CONTENT VIEW */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* AVAILABLE BALANCE HERO CARD (SOFT CHARCOAL) */}
<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
  <p className="text-white text-4xl font-bold">Available Balance</p>
  
  <div className="flex items-center gap-3 mt-1">
    <h2 className="text-4xl font-black text-white">
      {showAmounts ? `₹${metrics.balance.toLocaleString("en-IN")}` : "••••••"}
    </h2>
    <button 
      onClick={() => setShowAmounts(!showAmounts)} 
      className="text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-800"
      title={showAmounts ? "Hide balance" : "Show balance"}
    >
      {showAmounts ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  </div>

  

  <button
    onClick={() => setIsModalOpen(true)}
    className="mt-6 flex items-center gap-2 bg-emerald-600 text-zinc-950 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md hover:bg-zinc-700 transition-colors"
  >
    <Plus size={16} />
    <span>Add Transaction</span>
  </button>
</div>

          {/* COUNTER METRICS KPI GRID */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
  {/* Total Income */}
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
    <div className="flex justify-between items-center text-zinc-400 text-xs uppercase font-semibold">
      <span>Total Income</span>
      <ArrowUpRight className="text-emerald-400" size={16} />
    </div>
    <h3 className="text-2xl font-bold text-white mt-2">
      {showAmounts ? `₹${metrics.totalIncome.toLocaleString("en-IN")}` : "••••••"}
    </h3>
    <p className="text-zinc-500 text-[11px] mt-1">No active metrics logs</p>
  </div>

  {/* Total Expenses */}
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
    <div className="flex justify-between items-center text-zinc-400 text-xs uppercase font-semibold">
      <span>Total Expenses</span>
      <ArrowDownRight className="text-rose-400" size={16} />
    </div>
    <h3 className="text-2xl font-bold text-white mt-2">
      {showAmounts ? `₹${metrics.totalExpenses.toLocaleString("en-IN")}` : "••••••"}
    </h3>
    <p className="text-zinc-500 text-[11px] mt-1">No active metrics logs</p>
  </div>

  {/* Net Savings */}
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
    <div className="flex justify-between items-center text-zinc-400 text-xs uppercase font-semibold">
      <span>Net Savings</span>
      <Receipt className="text-zinc-400" size={16} />
    </div>
    <h3 className="text-2xl font-bold text-white mt-2">
      {showAmounts ? `₹${(metrics.totalIncome - metrics.totalExpenses).toLocaleString("en-IN")}` : "••••••"}
    </h3>
    <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-3 overflow-hidden border border-zinc-800">
      <div className="bg-zinc-400 h-full w-[99%]" />
    </div>
  </div>
</div>

          {/* RECENT ACTIVITY TABLE LOG (SOFT CHARCOAL CARD WITH CLEAN INLINE ROW ITEMS) */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg text-white">Recent Activity</h3>
            <p className="text-zinc-400 text-xs">Your latest logs and settlements</p>

            <div className="mt-5 space-y-3">
              {recentActivity.slice(0, 5).map((item, idx) => {
                const isIncome = item.type === "credit" || item.type === "income";
                const rowAmount = isIncome ? (item.credit_amount || 0) : (item.debit_amount || 0);

                return (
                  <div key={item.id || idx} className="flex justify-between items-center p-4 bg-zinc-800/40 rounded-xl border border-zinc-800 hover:bg-zinc-800/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl border ${isIncome ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" : "bg-rose-500/5 border-rose-500/10 text-rose-400"}`}>
                        {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.description}</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">{item.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${isIncome ? "text-emerald-400" : "text-rose-400"}`}>
                      {isIncome ? "+" : "-"}₹{Number(rowAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}

              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                  No active transactional records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* TRANSACTION OVERLAY MODAL (SOFT CHARCOAL) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors">
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <Receipt size={18} className="text-zinc-400" />
              <h3 className="font-bold text-lg text-white">Add Transaction</h3>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 text-white"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea
                  placeholder="Describe your transaction..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={100}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-zinc-700 text-white resize-none"
                />
                <div className="text-right text-[10px] text-zinc-500 mt-1">{notes.length}/100</div>
              </div>

              {formError && <p className="text-xs text-rose-400 font-medium bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">{formError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-black py-3 rounded-xl text-sm transition-all duration-200 active:scale-95 uppercase tracking-wider mt-2 shadow-md ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed bg-zinc-700 text-zinc-400"
                    : transactionType === "Income"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-rose-500 hover:bg-rose-600 text-white"
                }`}
              >
                {isSubmitting 
                  ? "Processing..." 
                  : transactionType === "Income" 
                  ? "Save Income" 
                  : "Save Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}