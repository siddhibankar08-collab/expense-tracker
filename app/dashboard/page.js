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
  ChevronDown
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("Expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingTx, setLoadingTx] = useState(false);
  const [txError, setTxError] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);


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

    // If you also keep user state:
    setUser(existingUser);
    
    // NEW: fetch latest balance for this user
    const { data: latestExpense, error: balanceError } = await supabase
      .from("expense")
      .select("balance")
      .eq("user_id", authData.user.id)  // filter to this user
      .order("id", { ascending: false }) // newest row first
      .limit(1)
      .single();

    if (!balanceError && latestExpense) {
      setAvailableBalance(latestExpense.balance);
    } else {
      // If no rows yet, keep it at 0
      setAvailableBalance(0);
    }

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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  
    async function handleTransactionSubmit(e) {
    e.preventDefault();
    setTxError("");
    setLoadingTx(true);

    // 1) Get logged-in user
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !authUser) {
      setTxError("You must be logged in to add a transaction.");
      setLoadingTx(false);
      return;
    }

    // 2) For now, use the hard-coded available balance as current balance (52300).
    // Later you will compute this from the DB.
    const currentBalance = availableBalance;

    if (!amount || Number(amount) <= 0) {
      setTxError("Amount must be a positive number.");
      setLoadingTx(false);
      return;
    }

    if (!date) {
      setTxError("Please select a date.");
      setLoadingTx(false);
      return;
    }

    // 3) Map "Income"/"Expense" to transactionType string
    const txType =
      transactionType === "Income" || transactionType === "income"
        ? "income"
        : "expense";

    // 4) Build payload for addTransaction
      const payload = {
        user_id: authUser.id,          // back in
        amount: Number(amount),
        transactionType: txType,       // "income" or "expense"
        currentBalance,
        date,                          // "YYYY-MM-DD"
        description: notes || null,
        due_amount: null,
      };

try {
  const res = await fetch("/api/expense/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to add transaction");
  }

  // 1) Read the created transaction row from the API
  const transaction = await res.json();

  // 2) Update the available balance in state using the new balance
  setAvailableBalance(transaction.balance);

  // 3) Clear form & close modal
  setAmount("");
  setDate("");
  setNotes("");
  setShowTransactionModal(false);
} catch (err) {
  console.error("Add transaction error:", err);
  setTxError(err.message);
} finally {
  setLoadingTx(false);
}
  }
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
      {/* SIDEBAR - Premium Black Gradient */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] flex-col fixed h-full border-r border-neutral-800 shadow-xl z-20">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shadow-md backdrop-blur-sm border border-white/10">
              <span className="text-white font-bold text-xl tracking-wider">S</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#04d292] tracking-tight">SpendWise</h1>
              <p className="text-[11px] font-medium text-neutral-400 tracking-wider uppercase">Personal Finance</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: PieChart, label: "Analytics" },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                item.active
                  ? "bg-white text-black font-semibold shadow-lg shadow-black/20"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} className={item.active ? "text-black" : "text-neutral-400 group-hover:text-white transition-colors"} />
              <span className="text-sm">{item.label}</span>
              {item.active && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* TOP BAR */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {greeting}, {user?.name || user?.email?.split("@")[0] || "User"} 👋
              </h1>
              <p className="text-neutral-400 text-xs mt-0.5">
                Your financial snapshot is up to date.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-[#121214] border border-neutral-800 rounded-xl px-3.5 py-2 transition-all focus-within:border-neutral-700 focus-within:bg-black focus-within:ring-2 focus-within:ring-white/5">
                <Search size={16} className="text-neutral-500" />
                <input
                  placeholder="Search transactions..."
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

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* HERO CARD - Deep Black & Charcoal Gradient */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] rounded-2xl p-8 shadow-xl border border-neutral-800 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff05_0%,transparent_60%)] pointer-events-none" />
            <p className="text-neutral-400 text-xs font-medium tracking-wider uppercase mb-1.5">Available Balance</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-2">₹{availableBalance}</h2>
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

          {/* BOTTOM ROW */}
          <div className="grid lg:grid-cols-1 gap-6">
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
        </div>
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

            <form className="p-6 space-y-4" onSubmit={handleTransactionSubmit}>
              {/* Type Dropdown Box */}
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

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 rounded-xl pl-8 pr-4 py-2.5 text-sm font-semibold outline-none transition-all text-white placeholder-neutral-600"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-all text-neutral-200"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Notes
                </label>
                <textarea
                  rows={2.5}
                  placeholder="What was this item or event for?..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#1C1C1E] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none placeholder-neutral-600 text-neutral-200"
                />
              </div>

              {txError && (
              <p className="text-xs text-red-400 font-medium">{txError}</p>
            )}

              {/* Action Submit */}
              <button
                type="submit"
                disabled={loadingTx}
                className={`w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white shadow-md transition-all active:scale-95 ${
                  transactionType === "Expense"
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-950/20"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-950/20"
                }`}
              >
                {loadingTx ? "Saving..." : `Save ${transactionType}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}