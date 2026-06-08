"use client";

import {
  LayoutDashboard,
  PieChart,
  Settings,
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

  // Core personal finance settings
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const saveProfileChanges = async () => {
    try {
      const { error } = await supabase
        .from("users")
        .update({ 
          name,
        })
        .eq("user_id", user.user_id);

      if (error) throw error;
      alert("Profile successfully updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile changes.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading preferences...</p>
        </div>
      </div>
    );
  }

  const getInitials = (fullName) => {
    if (!fullName) return "AK";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

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
          {/* PROFILE INFORMATION CARD */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="mb-2">
              <h2 className="font-bold text-white text-lg">Profile Information</h2>
              <p className="text-neutral-400 text-xs mt-0.5">Update your personal details</p>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <span className="text-[#04d292] font-bold text-xl tracking-wide">
                  {getInitials(name || user?.email)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">{name || "User Account"}</h3>
                <button type="button" className="text-neutral-400 text-xs hover:text-[#04d292] transition-colors mt-0.5">
                  Click avatar to upload a new photo
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-400">Email</label>
                <input
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              onClick={saveProfileChanges}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-neutral-200 transition-all rounded-xl font-semibold text-sm active:scale-95 shadow-md shadow-black/10"
            >
              Save Changes
            </button>
          </div>

          {/* CHANGE PASSWORD CARD */}
          <div className="bg-[#121214] rounded-2xl border border-neutral-800 p-6">
            <div className="mb-6">
              <h2 className="font-bold text-white text-lg">Change Password</h2>
              <p className="text-neutral-400 text-xs mt-0.5">Update your security credentials</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200 tracking-widest"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200 tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-300">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1C1C1E] border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neutral-700 text-neutral-200 tracking-widest"
                  />
                </div>
              </div>
            </div>

            <button className="mt-6 px-5 py-2.5 bg-white text-black hover:bg-neutral-200 transition-all text-sm font-semibold rounded-xl active:scale-95 shadow-md shadow-black/10">
              Update Password
            </button>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-rose-950/10 border border-rose-900/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Trash2 size={18} className="text-rose-400" />
              <h2 className="font-bold text-rose-400">Danger Zone</h2>
            </div>
            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
              Permanently remove your account and all stored financial records.
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