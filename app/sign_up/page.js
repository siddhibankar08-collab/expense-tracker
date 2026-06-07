"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Password validation patterns
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial;

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const canCreateAccount =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    isPasswordValid &&
    passwordsMatch &&
    acceptedTerms;

  async function handleSignUp(e) {
    e.preventDefault();

    if (!canCreateAccount) return;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.log("Signup error:", error.message);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          user_id: user.id,
          name: fullName,
          email: email,
          user_type: "user",
        });

      if (insertError) {
        console.log("INSERT FAILED:", insertError);
      }
    }

    router.push("/login");
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0A0A0C] text-neutral-100 font-sans antialiased overflow-hidden p-6">
      
      {/* SINGLE CORE CARD CONTAINER */}
      <div className="w-full max-w-6xl h-[90vh] bg-[#030303] rounded-[32px] border border-neutral-800/60 shadow-2xl overflow-hidden flex relative">
        
        {/* LEFT SIDE: Subtle Muted Charcoal-Emerald Gradient Layout */}
        <div className="flex-1 h-full bg-gradient-to-br from-[#111113] via-[#141816] to-[#0A0A0C] p-12 flex flex-col justify-between relative overflow-hidden border-r border-neutral-900">
          {/* Subdued ambient background glow */}
          <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
          
          {/* RESTORED: Original SpendWise Branding and Image filters */}
          <div className="flex items-center gap-5 relative z-10 shrink-0">
            <div className="p-2 bg-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-md">
              <Image
                src="/images/login-illustration.png"
                alt="Login illustrations"
                width={70}
                height={70  }
                className="object-contain invert sepia-emerald hue-rotate-60 brightness-125"
              />
            </div>
            <div>
              <h1 className="text-400 text-[#10B24D] text-3xl font-black tracking-tight leading-none">
                Spend<span className="text-[#10B24D]">Wise</span>
              </h1>
              <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mt-1.5">
                Track Smarter • Spend Better
              </p>
            </div>
          </div>

          {/* Hero Content & Big Feature Cards */}
          <div className="my-auto max-w-xl relative z-10 space-y-6">
            <div>
              <h2 className="text-white text-4xl font-black leading-tight tracking-tight">
                Money clarity <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">
                  for life and business.
                </span>
              </h2>
              <p className="text-neutral-400 text-sm mt-3 leading-relaxed font-medium">
                Manage personal finances and business expenses from one powerful dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5 max-w-[560px]">
              {[
                { icon: "💳", title: "Expense Tracking", desc: "Monitor every single incoming and outgoing ledger item transparently." },
                { icon: "🏪", title: "Business Insights", desc: "Understand distinct corporate multi-outlet growth trajectories effortlessly." },
                { icon: "📈", title: "Smart Reports", desc: "Generate breakdown summaries without configuration bottlenecks." },
                { icon: "📊", title: "Secure Data", desc: "All system coordinates remain isolated under production-tier encryption." }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="bg-[#121214]/30 backdrop-blur-sm border border-neutral-800/60 rounded-2xl p-5 transition-all duration-300 hover:border-neutral-700 hover:-translate-y-1 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg group-hover:bg-white group-hover:text-black transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-white text-sm font-bold mt-4 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-neutral-600 font-medium relative z-10 shrink-0">
            © 2026 SpendWise. Secure Analytics Engine Active.
          </p>
        </div>

        {/* RIGHT SIDE: Static Dark Pitch Black Form Panel */}
        <div className="w-[480px] h-full bg-[#030303] p-10 flex flex-col justify-center shrink-0 relative z-20 overflow-hidden">
          <div className="w-full space-y-5 my-auto">
            
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white tracking-tight">
                Create Account
              </h1>
              <p className="text-sm text-neutral-400 font-medium">
                Start your financial journey with SpendWise.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSignUp}>
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 bg-[#121214] rounded-xl px-4 border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 outline-none transition-all text-sm font-medium text-white placeholder-neutral-600"
                />
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 bg-[#121214] rounded-xl px-4 border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 outline-none transition-all text-sm font-medium text-white placeholder-neutral-600"
                />
              </div>

              {/* Password with HOVER Rules Card */}
              <div className="space-y-1.5 relative group">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 bg-[#121214] rounded-xl px-4 border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 outline-none transition-all text-sm font-medium text-white placeholder-neutral-700"
                />

                {/* Password Criteria Hover State */}
                <div className="absolute right-0 bottom-full mb-3 w-64 p-4 bg-[#121214] border border-neutral-800 rounded-2xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 space-y-1.5">
                  <p className="text-neutral-500 font-bold uppercase text-[9px] tracking-widest mb-2 border-b border-neutral-800 pb-1.5">Security Requirements</p>
                  <p className={`text-[11px] font-bold flex items-center gap-2 ${hasMinLength ? "text-emerald-400" : "text-neutral-500"}`}>
                    <span>{hasMinLength ? "✓" : "✗"}</span> 8+ Characters
                  </p>
                  <p className={`text-[11px] font-bold flex items-center gap-2 ${hasUppercase ? "text-emerald-400" : "text-neutral-500"}`}>
                    <span>{hasUppercase ? "✓" : "✗"}</span> Uppercase Letter
                  </p>
                  <p className={`text-[11px] font-bold flex items-center gap-2 ${hasLowercase ? "text-emerald-400" : "text-neutral-500"}`}>
                    <span>{hasLowercase ? "✓" : "✗"}</span> Lowercase Letter
                  </p>
                  <p className={`text-[11px] font-bold flex items-center gap-2 ${hasNumber ? "text-emerald-400" : "text-neutral-500"}`}>
                    <span>{hasNumber ? "✓" : "✗"}</span> Numeric Value
                  </p>
                  <p className={`text-[11px] font-bold flex items-center gap-2 ${hasSpecial ? "text-emerald-400" : "text-neutral-500"}`}>
                    <span>{hasSpecial ? "✓" : "✗"}</span> Special Symbol
                  </p>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-11 bg-[#121214] rounded-xl px-4 border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 outline-none transition-all text-sm font-medium text-white placeholder-neutral-700"
                />

                {confirmPassword.length > 0 && (
                  <p className={`text-xs font-bold mt-1 ${passwordsMatch ? "text-emerald-400" : "text-neutral-500"}`}>
                    {passwordsMatch ? "✓ Identity verified" : "✗ Passwords mismatch"}
                  </p>
                )}
              </div>

              {/* Acceptance Checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded-md bg-[#121214] border-neutral-800 text-white focus:ring-0 accent-neutral-200 cursor-pointer"
                />
                <p className="text-[11px] font-medium text-neutral-500 leading-snug">
                  I confirm acceptance of the Terms of Service and the global Privacy Policy.
                </p>
              </div>

              {/* Submission CTA */}
              <button
                type="submit"
                disabled={!canCreateAccount}
                className={`w-full h-12 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-md ${
                  canCreateAccount
                    ? "bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-white/5"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
              >
                Create Account
              </button>
            </form>

            <div className="text-center pt-1">
              <p className="text-sm text-neutral-500 font-medium">
                Already have an account?{" "}
                <span 
                  onClick={() => router.push("/login")}
                  className="font-bold text-white underline underline-offset-4 cursor-pointer hover:text-neutral-300"
                >
                  Log In
                </span>
              </p>
            </div>

            <p className="text-center text-[10px] font-medium text-neutral-600 leading-relaxed pt-2 border-t border-neutral-900">
              Your data parameters are securely encrypted. <br />
              SpendWise enforces strict personal profile data isolation.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}