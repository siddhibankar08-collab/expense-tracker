"use client";

import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
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
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("Expense");

  const [balance, setBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [savingsRate, setSavingsRate] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingTx, setLoadingTx] = useState(false);
  const [txError, setTxError] = useState("");

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

      // NEW: fetch latest metrics from expense table
      const { data: expenseRows, error: expenseError } = await supabase
        .from("expense")
        .select(
          "balance, credit_amount, debit_amount, type, date, description"
        )
        // you can add .eq("user_id", authData.user.id) later when RLS is stricter
        .order("created_at", { ascending: false });
      console.log("expenseRows:", expenseRows);
      console.log("expenseError:", expenseError);
      if (!expenseError && expenseRows && expenseRows.length > 0) {
        // 1) Balance = balance of the latest row
        const latest = expenseRows[0];
        setBalance(latest.balance || 0);

        // 2) Total income / expenses
        let income = 0;
        let expenses = 0;
        expenseRows.forEach((row) => {
          if (row.type === "credit") {
            income += row.credit_amount || 0;
          } else if (row.type === "debit") {
            expenses += row.debit_amount || 0;
          }
        });
        setTotalIncome(income);
        setTotalExpenses(expenses);

        // 3) Savings rate
        const total = income || 1;
        setSavingsRate(Math.round(((income - expenses) / total) * 100));

        // 4) Recent transactions list
        const mapped = expenseRows.slice(0, 10).map((row) => ({
          name:
            row.description || (row.type === "credit" ? "Income" : "Expense"),
          date: row.date,
          amount:
            (row.type === "credit" ? "+" : "-") +
            "₹" +
            (row.type === "credit"
              ? row.credit_amount || 0
              : row.debit_amount || 0
            ).toLocaleString("en-IN"),
          type: row.type === "credit" ? "income" : "expense",
        }));
        setTransactions(mapped);
      } else {
        // no rows yet
        setBalance(0);
        setTotalIncome(0);
        setTotalExpenses(0);
        setSavingsRate(0);
        setTransactions([]);
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  // Submit handler for the modal form
  //Temporary function 
async function handleTransactionSubmit(e) {
  e.preventDefault();
  setTxError("");
  setLoadingTx(true);

  try {
    // 1) Get auth user (keep your logic)
    const {
      data: { user: authUser },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !authUser) {
      setTxError("You must be logged in to add a transaction.");
      return;
    }

    // 2) Basic validation
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      setTxError("Amount must be a positive number.");
      return;
    }

    if (!date) {
      setTxError("Please select a date.");
      return;
    }

      const txType =
        transactionType === "Income" || transactionType === "income"
          ? "income"
          : "expense";

      const currentBalance = balance;

    const payload = {
      user_id: authUser.id,
      amount: numericAmount,
      transactionType: txType,
      currentBalance,
      date,
      description: notes || null,
      due_amount: null,
    };

      console.log("🔹 Sending payload to /api/expense/add:", payload);

      // 3) Call API
      const res = await fetch("/api/expense/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("🔹 Raw Response object:", res);

      // 4) Handle non-2xx
      if (!res.ok) {
        let data = {};
        try {
          data = await res.json();
        } catch (_) {
          // ignore JSON parse errors
        }
        console.log("🔹 Error response body:", data);
        throw new Error(
          data.error || `Failed to add transaction (status ${res.status})`
        );
      }

      // 5) Parse JSON
      const transaction = await res.json();
      console.log("✅ Transaction from API:", transaction);

      if (transaction.balance !== undefined) {
        setBalance(transaction.balance);
      }

      setAmount("");
      setDate("");
      setNotes("");
      setShowTransactionModal(false);
    } catch (err) {
      console.error("❌ Add transaction error (frontend):", err);
      setTxError(err.message || "Network error while adding transaction");
    } finally {
      setLoadingTx(false);
    }
  }

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-neutral-400">
            Loading your workspace...
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

        {/* Sidebar nav */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            {
              icon: LayoutDashboard,
              label: "Dashboard",
              path: "/dashboard",
              active: true,
            },
            { icon: PieChart, label: "Analytics", path: "/analytics" },
            { icon: Settings, label: "Settings", path: "/settings" },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3.5 w-full px-4 py-3 rounded-xl transition-all duration-200 group relative ${item.active
                ? "bg-white text-black font-semibold shadow-lg shadow-black/20"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <item.icon
                size={18}
                className={
                  item.active
                    ? "text-black"
                    : "text-neutral-400 group-hover:text-white transition-colors"
                }
              />
              <span className="text-sm">{item.label}</span>
              {item.active && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
              )}
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
                {greeting},{" "}
                {user?.name || user?.email?.split("@")[0] || "User"} 👋
              </h1>
              <p className="text-neutral-400 text-xs mt-0.5">
                Your financial snapshot is up to date.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-8 w-px bg-neutral-800 hidden md:block" />
              <div className="flex items-center gap-3 pl-1">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#121214] border border-neutral-700 flex items-center justify-center font-semibold text-white text-sm shadow-md">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-neutral-200 leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    Premium Account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* HERO CARD */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] rounded-2xl p-8 shadow-xl border border-neutral-800 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff05_0%,transparent_60%)] pointer-events-none" />
            <p className="text-neutral-400 text-xs font-medium tracking-wider uppercase mb-1.5">
              Available Balance
            </p>
            <h2 className="text-4xl font-black tracking-tight mb-2">
              ₹{balance.toLocaleString("en-IN")}
            </h2>
            <div className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium mb-6 bg-neutral-800/40 w-fit px-2.5 py-1 rounded-full border border-neutral-800">
              <TrendingUp size={14} className="text-neutral-500" />
              <span>0% change from last period</span>
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
                <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">
                  Total Expenditure
                </p>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <ArrowDownRight size={16} className="rotate-180" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">
                ₹{totalIncome.toLocaleString("en-IN")}
              </h3>

            </div>

            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">
                  Total Expenses
                </p>
                <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </h3>

            </div>

            <div className="bg-[#121214] rounded-2xl p-5 border border-neutral-800 shadow-sm relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">
                  Net Savings
                </p>
                <div className="p-2 bg-white/5 text-white rounded-xl">
                  <Wallet size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">
                ₹{(totalIncome - totalExpenses).toLocaleString("en-IN")}
              </h3>              <div className="mt-2 w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-neutral-700 h-full rounded-full"
                  style={{ width: `${savingsRate}%` }}
                ></div>
              </div>
              <p className="text-neutral-500 text-[11px] font-medium mt-1.5">
                0% Savings rate achieved
              </p>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="grid lg:grid-cols-1 gap-6">
            <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="font-bold text-white tracking-tight">
                    Recent Activity
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Your latest logs and settlements
                  </p>
                </div>
              </div>

              {transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 text-neutral-500 mb-3">
                    <Receipt size={22} strokeWidth={1.5} />
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-300">
                    No recent activity yet
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 max-w-[240px] text-center leading-relaxed">
                    Connected backend entry files are empty. Click add
                    transaction above to update metrics.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {transactions.map((txn, idx) => {
                    const isIncome = txn.type === "income";
                    return (
                      <div
                        key={idx}
                        className={`flex justify-between items-center p-3.5 rounded-xl border transition-all duration-200 hover:scale-[1.005] ${isIncome
                          ? "bg-emerald-950/10 border-emerald-500/10 hover:border-emerald-500/20"
                          : "bg-rose-950/10 border-rose-500/10 hover:border-rose-500/20"
                          }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isIncome
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              }`}
                          >
                            {isIncome ? (
                              <ArrowDownRight
                                size={18}
                                className="rotate-180"
                              />
                            ) : (
                              <Receipt size={18} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-neutral-200">
                              {txn.name}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              {txn.date}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-bold text-sm tracking-tight ${isIncome ? "text-emerald-400" : "text-rose-400"
                            }`}
                        >
                          {txn.amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* TRANSACTION MODAL */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#121214] w-full max-w-md rounded-2xl shadow-2xl border border-neutral-800 overflow-hidden">
            <div className="px-6 py-4 bg-[#1C1C1E] border-b border-neutral-800 flex justify-between items-center">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-neutral-400" />
                Add Transaction
              </h2>
              <button
                onClick={() => setShowTransactionModal(false)}
                className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleTransactionSubmit}>
              {/* Transaction Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                  Transaction Type
                </label>
                <div className="relative">
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none text-neutral-200 appearance-none cursor-pointer"
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
                    className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl pl-8 pr-4 py-2.5 text-sm font-semibold outline-none text-white placeholder-neutral-600"
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
                  className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none text-neutral-200"
                />
              </div>

              {/* Notes */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Notes
                  </label>
                  <span className={`text-[10px] font-medium ${notes.length > 100 ? "text-rose-400" : "text-neutral-500"}`}>
                    {notes.length}/100
                  </span>
                </div>
                <textarea
                  rows={2.5}
                  placeholder="What was this item or event for? (Required)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={100}
                  required
                  className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-2.5 text-sm outline-none resize-none text-neutral-200 placeholder-neutral-600"
                />
              </div>

              {/* Error message */}
              {txError && (
                <p className="text-xs text-red-400 font-medium">{txError}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loadingTx}
                className={`w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white shadow-md ${transactionType === "Expense"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
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