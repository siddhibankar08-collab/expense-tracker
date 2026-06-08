"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  LayoutDashboard,
  PieChart,
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
    balance: 20000, // Fallback start balance seen in your screenshot
    totalIncome: 0,
    totalExpenses: 0,
  });

  // Modal Interactive States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("Income"); // Dropdown state
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      // Fetch Profile Profile
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
        .order("date", { ascending: false });

      if (!error && expenseData) {
        setRecentActivity(expenseData);

        // Compute Metrics Aggregates based on your database rows
        const incomeSum = expenseData.reduce((sum, item) => sum + Number(item.credit_amount || 0), 0);
        const expenseSum = expenseData.reduce((sum, item) => sum + Number(item.debit_amount || 0), 0);
        
        // If there are existing records, take the balance of the newest transaction
        const currentRunningBalance = expenseData.length > 0 
          ? Number(expenseData[0].balance || 0) 
          : 20000;

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
      if (!notes.trim()) throw new Error("Please add a description");

      // 1. Normalize type check constraint ('credit' or 'debit')
      const backendType = transactionType.toLowerCase() === "income" ? "credit" : "debit";

      // 2. Client-side math calculation to satisfy balance numeric NOT NULL
      const currentRunningBalance = Number(metrics.balance || 0);
      const computedNewBalance = backendType === "credit"
        ? currentRunningBalance + numericAmount
        : currentRunningBalance - numericAmount;

      // 3. Assemble exact schema matching layout payload
      const payload = {
        user_id: user.user_id,
        type: backendType,
        date: date,
        description: notes,
        credit_amount: backendType === "credit" ? numericAmount : null,
        debit_amount: backendType === "debit" ? numericAmount : null,
        balance: computedNewBalance,
        due_amount: null,
      };

      const { error } = await supabase.from("expense").insert([payload]);

      if (error) throw error;

      // Update UI state locally immediately
      setMetrics((prev) => ({
        ...prev,
        balance: computedNewBalance,
        totalIncome: backendType === "credit" ? prev.totalIncome + numericAmount : prev.totalIncome,
        totalExpenses: backendType === "debit" ? prev.totalExpenses + numericAmount : prev.totalExpenses,
      }));

      // Re-fetch ledger list items dynamically
      setRecentActivity((prev) => [payload, ...prev]);

      // Reset Modal Fields
      setAmount("");
      setNotes("");
      setIsModalOpen(false);

      // Force route data caches to drop across other screens
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
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading your profile snapshot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 flex relative">
      
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
              <h1 className="font-bold text-lg text-[#04d292] tracking-tight leading-tight">SpendWise</h1>
              <p className="text-[10px] font-semibold text-neutral-500 tracking-wider uppercase">Personal Finance</p>
            </div>
          </div>
        </div>

<nav className="flex-1 px-4 py-6 space-y-1.5 flex flex-col h-[calc(100%-80px)]">          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl bg-white text-black font-semibold shadow-lg shadow-black/20 text-left relative">
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
          </button>
          <button onClick={() => router.push("/analytics")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all">
            <PieChart size={18} />
            <span className="text-sm">Analytics</span>
          </button>
          <button onClick={() => router.push("/transactions")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all">
            <Receipt size={18} />
            <span className="text-sm">Transactions</span>
          </button>
          <button onClick={() => router.push("/settings")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all">
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
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Good Afternoon, {user?.name || "User"} 👋</h1>
            <p className="text-neutral-500 text-xs font-medium mt-0.5">Your financial snapshot is up to date.</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#121214] border border-neutral-700 flex items-center justify-center font-semibold text-white text-sm">
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </div>
        </header>

        {/* CONTENT VIEW */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* AVAILABLE BALANCE SNAPSHOT HERO CARD */}
          <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <p className="text-neutral-400 text-xs uppercase tracking-wider font-semibold">Available Balance</p>
            <h2 className="text-4xl font-black text-white mt-1">₹{metrics.balance.toLocaleString("en-IN")}</h2>
            <div className="inline-flex items-center gap-1.5 text-neutral-500 text-xs mt-2 bg-neutral-900/50 px-2.5 py-1 rounded-full border border-neutral-800">
              <TrendingUp size={12} />
              <span>0% change from last period</span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 flex items-center gap-2 bg-white text-black font-semibold px-4 py-2.5 rounded-xl text-sm shadow-md hover:bg-neutral-200 transition-colors"
            >
              <Plus size={16} />
              <span>Add Transaction</span>
            </button>
          </div>

          {/* COUNTER METRICS KPI GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-center text-neutral-400 text-xs uppercase font-semibold">
                <span>Total Income</span>
                <ArrowUpRight className="text-emerald-400" size={16} />
              </div>
              <h3 className="text-2xl font-bold text-white mt-2">₹{metrics.totalIncome.toLocaleString("en-IN")}</h3>
              <p className="text-neutral-500 text-[11px] mt-1">No active metrics logs</p>
            </div>

            <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-center text-neutral-400 text-xs uppercase font-semibold">
                <span>Total Expenses</span>
                <ArrowDownRight className="text-rose-400" size={16} />
              </div>
              <h3 className="text-2xl font-bold text-white mt-2">₹{metrics.totalExpenses.toLocaleString("en-IN")}</h3>
              <p className="text-neutral-500 text-[11px] mt-1">No active metrics logs</p>
            </div>

            <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-5">
              <div className="flex justify-between items-center text-neutral-400 text-xs uppercase font-semibold">
                <span>Net Savings</span>
                <Receipt className="text-neutral-400" size={16} />
              </div>
              <h3 className="text-2xl font-bold text-white mt-2">
                Template: ₹{(metrics.totalIncome - metrics.totalExpenses).toLocaleString("en-IN")}
              </h3>
              <div className="w-full bg-neutral-900 h-1.5 rounded-full mt-3 overflow-hidden border border-neutral-800">
                <div className="bg-neutral-400 h-full w-[99%]" />
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY TABLE LOG */}
          <div className="bg-[#121214] border border-neutral-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white">Recent Activity</h3>
            <p className="text-neutral-500 text-xs">Your latest logs and settlements</p>

            <div className="mt-5 space-y-3">
              {recentActivity.slice(0, 5).map((item, idx) => {
                const isIncome = item.type === "credit" || item.type === "income";
                const rowAmount = isIncome ? (item.credit_amount || 0) : (item.debit_amount || 0);

                return (
                  <div key={item.id || idx} className="flex justify-between items-center p-4 bg-neutral-900/40 rounded-xl border border-neutral-800 hover:bg-neutral-900/80 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl border ${isIncome ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" : "bg-rose-500/5 border-rose-500/10 text-rose-400"}`}>
                        {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.description}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">{item.date}</p>
                      </div>
                    </div>
                    <span className={`font-bold text-sm ${isIncome ? "text-emerald-400" : "text-rose-400"}`}>
                      {isIncome ? "+" : "-"}₹{Number(rowAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}

              {recentActivity.length === 0 && (
                <div className="text-center py-8 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                  No active transactional records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* TRANSACTION OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-[#121214] border border-neutral-800 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors">
              <X size={18} />
            </button>

            <div className="flex items-center gap-2.5 mb-6">
              <Receipt size={18} className="text-neutral-400" />
              <h3 className="font-bold text-lg text-white">Add Transaction</h3>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-white"
                >
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-white appearance-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea
                  placeholder="Describe your transaction..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={100}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm focus:outline-none focus:border-neutral-700 text-white resize-none"
                />
                <div className="text-right text-[10px] text-neutral-500 mt-1">{notes.length}/100</div>
              </div>

              {formError && <p className="text-xs text-rose-400 font-medium bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">{formError}</p>}

              <button
  type="submit"
  disabled={isSubmitting}
  className={`w-full font-black py-3 rounded-xl text-sm transition-all duration-200 active:scale-95 uppercase tracking-wider mt-2 shadow-md ${
    isSubmitting
      ? "opacity-50 cursor-not-allowed bg-neutral-700 text-neutral-400"
      : transactionType === "Income"
      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/10"
      : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10"
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