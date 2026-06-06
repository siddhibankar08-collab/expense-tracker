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
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-br from-[#1C1C1E] via-[#121214] to-[#0A0A0C] flex-col fixed h-full border-r border-neutral-800">
        <div className="p-6 border-b border-neutral-800">
          <h1 className="font-bold text-xl text-[#04d292]">
            SpendWise
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={() => router.push("/analytics")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5"
          >
            <PieChart size={18} />
            Analytics
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold">
            <Settings size={18} />
            Settings
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 lg:ml-64 p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-neutral-400 text-xs uppercase tracking-wider">
            Preferences
          </p>

          <h1 className="text-4xl font-black mt-2">
            Settings
          </h1>
        </div>

        <div className="space-y-6">
          {/* PROFILE */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User size={18} />
              <h2 className="font-bold">
                Profile Information
              </h2>
            </div>

            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Name"
                className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3"
              />

              <input
                value={user?.email || ""}
                disabled
                className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-500"
              />
            </div>
          </div>

          {/* FINANCIAL */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Wallet size={18} />
              <h2 className="font-bold">
                Financial Preferences
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value)
                }
                placeholder="Monthly Budget"
                className="bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3"
              />

              <input
                value={goal}
                onChange={(e) =>
                  setGoal(e.target.value)
                }
                placeholder="Savings Goal"
                className="bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3"
              />
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell size={18} />
              <h2 className="font-bold">
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
                  className="flex justify-between items-center"
                >
                  <span>{item}</span>

                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 accent-[#04d292]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SECURITY */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield size={18} />
              <h2 className="font-bold">
                Security
              </h2>
            </div>

            <button className="px-4 py-3 bg-[#1C1C1E] border border-neutral-800 rounded-xl hover:bg-black">
              Change Password
            </button>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={saveProfile}
              className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-semibold"
            >
              <Save size={16} />
              Save Changes
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-800 rounded-xl"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-rose-950/20 border border-rose-900 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trash2
                size={18}
                className="text-rose-400"
              />
              <h2 className="font-bold text-rose-400">
                Danger Zone
              </h2>
            </div>

            <p className="text-neutral-400 mb-4">
              Permanently remove your account and all
              stored financial records.
            </p>

            <button className="px-5 py-3 bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold">
              Delete Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}