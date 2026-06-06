"use client";

import {
  LayoutDashboard,
  PieChart,
  Settings,
  Bell,
  Shield,
  User,
  Wallet,
  Save,
  LogOut,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("50000");
  const [goal, setGoal] = useState("100000");

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      setUser(profile);
      setName(profile?.name || "");
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const saveProfile = async () => {
    await supabase
      .from("users")
      .update({ name })
      .eq("user_id", user.user_id);

    alert("Profile Updated");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex">
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

        {/* Navigation Sidebar Synced with Application State Paths */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
            { icon: PieChart, label: "Analytics", path: "/analytics" },
            { icon: Settings, label: "Settings", path: "/settings", active: true },
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
              <item.icon size={18} className={item.active ? "text-black" : "text-neutral-400 group-hover:text-white transition-colors"} />
              <span className="text-sm">{item.label}</span>
              {item.active && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />}
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENT CONTAINER */}
      <main className="flex-1 lg:ml-64 p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <p className="text-neutral-400 text-xs uppercase tracking-wider">
            Preferences
          </p>

          <h1 className="text-4xl font-black mt-2 tracking-tight">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* PROFILE */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User size={18} className="text-neutral-400" />
              <h2 className="font-bold text-white">
                Profile Information
              </h2>
            </div>

            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200"
              />

              <input
                value={user?.email || ""}
                disabled
                className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* FINANCIAL */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Wallet size={18} className="text-neutral-400" />
              <h2 className="font-bold text-white">
                Financial Preferences
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Monthly Budget"
                className="bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200"
              />

              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Savings Goal"
                className="bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200"
              />
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={18} className="text-neutral-400" />
              <h2 className="font-bold text-white">
                Notifications
              </h2>
            </div>

            <div className="space-y-4">
              {[
                "Transaction Alerts",
                "Weekly Reports",
                "Due Reminders",
              ].map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center text-sm text-neutral-300"
                >
                  <span>{item}</span>

                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-[#04d292] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECURITY */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={18} className="text-neutral-400" />
              <h2 className="font-bold text-white">
                Security
              </h2>
            </div>

            <button className="px-4 py-2.5 bg-[#1C1C1E] border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-all text-xs font-semibold text-neutral-200">
              Change Password
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={saveProfile}
              className="flex items-center gap-2 px-5 py-3 bg-white text-black hover:bg-neutral-100 transition-all rounded-xl font-semibold text-sm active:scale-95 shadow-md shadow-black/10"
            >
              <Save size={16} />
              Save Changes
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-800 hover:bg-neutral-700 transition-all rounded-xl text-neutral-200 text-sm active:scale-95"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-rose-950/10 border border-rose-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trash2
                size={18}
                className="text-rose-400"
              />
              <h2 className="font-bold text-rose-400">
                Danger Zone
              </h2>
            </div>

            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
              Permanently remove your account and all
              stored financial records.
            </p>

            <button className="px-5 py-3 bg-rose-600 hover:bg-rose-700 transition-all text-sm rounded-xl font-semibold text-white active:scale-95 shadow-md shadow-rose-900/20">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}