"use client";

import {
  LayoutDashboard,
  PieChart,
  Settings,
  Receipt,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  Key,
  RotateCcw,
  Plus,
  CheckCircle,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function FeatureAccessPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [featureAccess, setFeatureAccess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Form States for Assigning New Features
  const [targetUserId, setTargetUserId] = useState("");
  const [targetFeatureId, setTargetFeatureId] = useState("");

  const showBanner = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const fetchAccessMatrix = async () => {
    const { data: accessData, error } = await supabase
      .from("user_feature_access")
      .select(`
        access_id,
        user_id,
        feature_id,
        granted_by,
        granted_at
      `)
      .order("granted_at", { ascending: false });

    if (error) console.error("Fetch Error:", error);
    else setFeatureAccess(accessData || []);
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      setUser(userData);
      await fetchAccessMatrix();
      setLoading(false);
    };

    initPage();
  }, [router]);

  // GRANT ACCESS HANDLER
  const handleGrantAccess = async (e) => {
    e.preventDefault();
    if (!targetUserId || !targetFeatureId) {
      showBanner("Please fill out both UUID fields.", "error");
      return;
    }

    setActionLoading(true);
    const newAccessId = crypto.randomUUID();

    const { error } = await supabase
      .from("user_feature_access")
      .insert([
        {
          access_id: newAccessId,
          user_id: targetUserId,
          feature_id: targetFeatureId,
          granted_by: user?.user_id || null,
          granted_at: new Date().toISOString(),
        }
      ]);

    setActionLoading(false);

    if (error) {
      showBanner(`Grant failed: ${error.message}`, "error");
    } else {
      showBanner("Privileges granted successfully.");
      setTargetUserId("");
      setTargetFeatureId("");
      fetchAccessMatrix();
    }
  };

  // REVOKE / ROLLBACK ACCESS HANDLER
  const handleRevokeAccess = async (accessId) => {
    if (!confirm("Are you sure you want to rollback/revoke this feature permission?")) return;

    setActionLoading(true);
    const { error } = await supabase
      .from("user_feature_access")
      .delete()
      .eq("access_id", accessId);

    setActionLoading(false);

    if (error) {
      showBanner(`Revoke failed: ${error.message}`, "error");
    } else {
      showBanner("Privilege cleanly rolled back.", "success");
      fetchAccessMatrix();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0C]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-neutral-200 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">Loading infrastructure matrices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-neutral-100 flex">
      
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
                Management Suite
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all">
            <LayoutDashboard size={18} />
            <span className="text-sm">Dashboard</span>
          </button>
          <button onClick={() => router.push("/analytics")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all">
            <PieChart size={18} />
            <span className="text-sm">Analytics</span>
          </button>
          <button onClick={() => router.push("/transactions")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all">
            <Receipt size={18} />
            <span className="text-sm">Transactions</span>
          </button>
          <button onClick={() => router.push("/features")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl bg-white text-black font-semibold shadow-lg shadow-black/20 text-left relative">
            <ShieldCheck size={18} className="text-black" />
            <span className="text-sm">Access Control</span>
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
          </button>
          <button onClick={() => router.push("/settings")} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-neutral-400 hover:bg-white/5 text-left transition-all">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 lg:ml-64">
        
        {/* TOAST SYSTEM NOTIFICATION */}
        {notification.show && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${
            notification.type === "error" 
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300" 
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          }`}>
            <CheckCircle size={16} />
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        {/* HEADER */}
        <header className="bg-[#0A0A0C]/80 backdrop-blur-md border-b border-neutral-800 px-8 py-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-white">Identity Access Management 🔐</h1>
              <p className="text-neutral-400 text-xs mt-0.5">
                Provision new operational structures or process systemic rolebacks.
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#121214] border border-neutral-700 flex items-center justify-center font-semibold text-white text-sm">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          
          {/* TOP SECTIONS: ACTION CARD & SYS INFO */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* PROVISION FEATURE FORM MODULE */}
            <div className="lg:col-span-2 bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus size={18} className="text-[#04d292]" />
                <h2 className="font-bold text-white text-base">Provision New Scope Access</h2>
              </div>
              
              <form onSubmit={handleGrantAccess} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      User Context Identifier (UUID)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. d3b07384-d113-4956-a5cc..."
                      value={targetUserId}
                      onChange={(e) => setTargetUserId(e.target.value)}
                      className="w-full bg-[#0A0A0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                      Target Feature Identifier (UUID)
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 8f2b8421-482a-4c28-9811..."
                      value={targetFeatureId}
                      onChange={(e) => setTargetFeatureId(e.target.value)}
                      className="w-full bg-[#0A0A0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-xs font-bold shadow-lg hover:bg-neutral-200 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={3} />
                    {actionLoading ? "Executing SQL..." : "Grant System Authorization"}
                  </button>
                </div>
              </form>
            </div>

            {/* REALTIME SYSTEM HEALTH OVERVIEW */}
            <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800 flex flex-col justify-between">
              <div>
                <p className="text-neutral-500 text-[10px] font-semibold uppercase tracking-wider">Security State</p>
                <h3 className="text-4xl font-black mt-2 text-white">{featureAccess.length} Active</h3>
                <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
                  Cryptographic parameters are parsed out and executed on tablespace <span className="font-mono text-emerald-400">pg_default</span>.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Key size={12} /> Live Active Audit
                </span>
                <span>Active Principal: {user?.name || "Root Admin"}</span>
              </div>
            </div>
          </div>

          {/* PRIVILEGED DATA SECURITY LOGS / ROLLBACK LISTING */}
          <div className="bg-[#121214] rounded-2xl p-6 border border-neutral-800 shadow-xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="font-bold text-white text-base">Active Privilege Logs Matrix</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Historical and immediate access provisions. Process atomic record rollbacks via action vectors.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 text-left text-xs uppercase tracking-wider">
                    <th className="py-3 font-semibold">Access Row Vector</th>
                    <th className="py-3 font-semibold">User Associated</th>
                    <th className="py-3 font-semibold">Allocated Feature Block</th>
                    <th className="py-3 font-semibold">Authorized By</th>
                    <th className="py-3 font-semibold text-right">System Action Rollback</th>
                  </tr>
                </thead>
                <tbody>
                  {featureAccess.map((row) => (
                    <tr key={row.access_id} className="border-b border-neutral-800/70 hover:bg-white/[0.01] text-neutral-300 font-mono text-xs transition-all">
                      <td className="py-4 text-[#04d292] font-semibold max-w-[120px] truncate">
                        {row.access_id}
                      </td>
                      <td className="py-4 text-neutral-300 max-w-[140px] truncate">
                        {row.user_id}
                      </td>
                      <td className="py-4 text-neutral-400 max-w-[140px] truncate">
                        {row.feature_id}
                      </td>
                      <td className="py-4 text-neutral-500 max-w-[120px] truncate">
                        {row.granted_by ? row.granted_by : "System Auto-Seed"}
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleRevokeAccess(row.access_id)}
                          disabled={actionLoading}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 font-sans font-medium text-[11px] hover:bg-rose-500 hover:text-white disabled:opacity-40 transition-all cursor-pointer"
                        >
                          <RotateCcw size={12} />
                          Revoke / Rollback
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {featureAccess.length === 0 && (
                <div className="text-center py-16 text-neutral-500 border border-dashed border-neutral-800 rounded-xl mt-4 font-sans text-sm flex flex-col items-center justify-center gap-2">
                  <ShieldAlert size={24} className="text-neutral-600" />
                  No feature access maps found within database architecture.
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}