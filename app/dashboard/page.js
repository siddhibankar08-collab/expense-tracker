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
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const monthlyData = [
    { name: "Jan", amount: 32000 },
    { name: "Feb", amount: 28500 },
    { name: "Mar", amount: 31000 },
    { name: "Apr", amount: 27800 },
    { name: "May", amount: 31500 },
    { name: "Jun", amount: 29600 },
  ];

  const categories = [
    { name: "Food", amount: 4200, percentage: 35 },
    { name: "Transport", amount: 1900, percentage: 16 },
    { name: "Shopping", amount: 2800, percentage: 23 },
    { name: "Entertainment", amount: 1100, percentage: 9 },
  ];

  const transactions = [
    { name: "Netflix Subscription", date: "Today", amount: "-₹499" },
    { name: "Grocery Shopping", date: "Yesterday", amount: "-₹1,250" },
    { name: "Salary Credited", date: "1 Jun", amount: "+₹25,000" },
    { name: "Uber Ride", date: "2 Jun", amount: "-₹350" },
  ];

  const budgets = [
    { name: "Food", spent: 4200, limit: 6000 },
    { name: "Transport", spent: 1900, limit: 2500 },
    { name: "Shopping", spent: 2800, limit: 5000 },
    { name: "Entertainment", spent: 1100, limit: 2000 },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[#1B2F6B] flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#1B2F6B]">SpendWise</h1>
              <p className="text-xs text-gray-500">Personal Finance</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 pt-6 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: true },
            { icon: Wallet, label: "Wallet" },
            { icon: Receipt, label: "Transactions" },
            { icon: PieChart, label: "Analytics" },
            { icon: Target, label: "Budgets" },
            { icon: Settings, label: "Settings" },
          ].map((item, idx) => (
            <button
              key={idx}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition ${
                item.active
                  ? "bg-[#1B2F6B] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 m-4 bg-[#1B2F6B] rounded-xl">
          <p className="text-white text-sm font-medium mb-2">Financial Goal</p>
          <p className="text-white/80 text-xs mb-3">72% towards savings target</p>
          <div className="h-1.5 bg-white/20 rounded">
            <div className="h-1.5 w-[72%] bg-white rounded"></div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-64">
        {/* TOP BAR */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting}, Aarya 👋
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Your finances are looking healthy this month
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-1.5">
                <Search size={16} className="text-gray-400" />
                <input
                  placeholder="Search"
                  className="bg-transparent outline-none ml-2 text-sm w-48"
                />
              </div>
              <button className="p-2 bg-white border rounded-lg">
                <Bell size={18} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1B2F6B] flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium hidden md:block">Aarya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* HERO CARD */}
          <div className="bg-gradient-to-r from-[#1B2F6B] to-[#2D4A8C] rounded-2xl p-6 mb-6">
            <p className="text-white/80 text-sm mb-1">Total Balance</p>
            <h2 className="text-5xl font-bold text-white mb-2">₹52,300</h2>
            <p className="text-green-300 text-sm mb-4">+12.4% from last month</p>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white/10 rounded-lg text-white text-sm hover:bg-white/20 transition">
                <Plus size={16} className="inline mr-1" />
                Add Expense
              </button>
              <button className="px-4 py-2 bg-white rounded-lg text-[#1B2F6B] text-sm font-medium hover:shadow transition">
                <CreditCard size={16} className="inline mr-1" />
                Add Income
              </button>
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Income</p>
              <h3 className="text-2xl font-bold mt-1">₹18,000</h3>
              <p className="text-green-600 text-xs mt-1">+8.1%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Expenses</p>
              <h3 className="text-2xl font-bold mt-1">₹12,450</h3>
              <p className="text-red-500 text-xs mt-1">+3.4%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Savings</p>
              <h3 className="text-2xl font-bold mt-1">₹5,550</h3>
              <p className="text-gray-500 text-xs mt-1">27% rate</p>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <p className="text-gray-500 text-sm">Budgets</p>
              <h3 className="text-2xl font-bold mt-1">8/12</h3>
              <p className="text-gray-500 text-xs mt-1">4 remaining</p>
            </div>
          </div>

          {/* CHARTS ROW */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-5 border">
              <h2 className="font-semibold mb-4">Monthly Spending Trend</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" stroke="#1B2F6B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <h2 className="font-semibold mb-4">Category Breakdown</h2>
              <div className="space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.name}</span>
                      <span className="font-semibold">₹{cat.amount}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded">
                      <div
                        className="h-2 bg-[#1B2F6B] rounded"
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border">
              <h2 className="font-semibold mb-4">Recent Transactions</h2>
              <div className="space-y-3">
                {transactions.map((txn, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium text-sm">{txn.name}</p>
                      <p className="text-xs text-gray-500">{txn.date}</p>
                    </div>
                    <span className={`font-semibold text-sm ${txn.amount.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                      {txn.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border">
              <h2 className="font-semibold mb-4">Budget Progress</h2>
              <div className="space-y-4">
                {budgets.map((budget, idx) => {
                  const percent = (budget.spent / budget.limit) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{budget.name}</span>
                        <span>₹{budget.spent} / ₹{budget.limit}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded">
                        <div
                          className="h-2 bg-[#1B2F6B] rounded"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}