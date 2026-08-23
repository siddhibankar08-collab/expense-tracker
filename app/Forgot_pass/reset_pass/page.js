"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

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

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Auto-redirect user away 3 seconds after a successful password save
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, router]);

  async function handleResetSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setShowPopup(false);

    // Validation check for empty entry or incorrect patterns
    if (password.trim() === "") {
      setErrorMsg("Please enter your new password first.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMsg("Password credentials do not meet security regulations.");
      return;
    }

    if (!passwordsMatch) {
      setErrorMsg("Identity check failed. Passwords do not match.");
      return;
    }

    // Submit password updates to your Supabase auth instance
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Trigger success status toast popup
    setShowPopup(true);
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-gradient-to-br from-[#121513] via-[#161C19] to-[#0E100F] text-neutral-100 font-sans antialiased overflow-hidden p-6 pt-[8vh] gap-4">
      
      {/* CARD SHIFTED LOWER ON THE Y-AXIS */}
      <div className="w-full max-w-md bg-[#030303] rounded-[32px] border border-neutral-800/60 shadow-2xl py-7 px-10 flex flex-col justify-center relative overflow-hidden shrink-0 mx-auto mt-auto mb-auto">
        
        {/* Soft, visible decorative glow behind card contents */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full space-y-5 relative z-10">
          
          {/* Logo Branding Icon Centered */}
          <div className="flex flex-col items-center justify-center gap-2 text-center">
<div className="p-1.5 bg-black backdrop-blur-sm rounded-xl border border-[#04d292] shadow-sm flex items-center justify-center shrink-0">              <Image
                src="/images/spend.png"
                alt="SpendWise Logo"
                width={46}
                height={46}
              />
            </div>
            <div className="inline-block bg-neutral-900 border border-neutral-800 px-3 py-0.5 rounded-full mt-1">
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                Security Update
              </span>
            </div>
          </div>

          {/* Heading Block */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Reset Password
            </h1>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-xs mx-auto">
              Choose a strong password parameters layout to protect your production dashboard metrics environment.
            </p>
          </div>

          {/* Form Action Layout */}
          <form className="space-y-3.5" onSubmit={handleResetSubmit} noValidate>
            
            {/* New Password Input with FLOATING HOVER CRITERIA CARD */}
            <div className="space-y-1.5 relative group">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className={`w-full h-10 rounded-xl pl-4 pr-12 bg-[#121214] border outline-none transition-all text-sm font-medium text-white placeholder-neutral-700 focus:bg-black focus:ring-4 ${
                    errorMsg && password.trim() === ""
                      ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/10"
                      : "border-neutral-800 focus:border-neutral-700 focus:ring-white/5"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
                >
                  {showNewPass ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password Criteria Hover State Card */}
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
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  className="w-full h-10 rounded-xl pl-4 pr-12 bg-[#121214] border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 outline-none transition-all text-sm font-medium text-white placeholder-neutral-700"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
                >
                  {showConfirmPass ? "🙈" : "👁️"}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <p className={`text-xs font-bold mt-1 ${passwordsMatch ? "text-emerald-400" : "text-neutral-500"}`}>
                  {passwordsMatch ? "✓ Identity verified" : "✗ Passwords mismatch"}
                </p>
              )}
            </div>

            {/* Global Context Error Response Display block */}
            {errorMsg && (
              <p className="text-red-400 text-xs font-semibold mt-1 flex items-center gap-1.5 animate-fadeIn">
                <span>⚠️</span> {errorMsg}
              </p>
            )}

            {/* Execution CTA Submission Button */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-md bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-white/5"
            >
              Update Security Credentials
            </button>
          </form>

          {/* Core Navigation Hook Back to Route */}
          <div className="text-center pt-0.5">
            <span 
              onClick={() => router.push("/Forgot_pass")}
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
            >
              ← Back
            </span>
          </div>

          {/* Bottom Security Subscript */}
          <p className="text-center text-[10px] font-medium text-neutral-600 leading-relaxed pt-2.5 border-t border-neutral-900">
            * Ensure your modified password metrics utilize varied system symbols and values for maximum framework defense.
          </p>

        </div>
      </div>

      {/* FLOATING SUCCESS TOAST POPUP BELOW THE CARD */}
      <div 
        className={`w-full max-w-md bg-[#0A0A0C] border border-emerald-500/30 shadow-[0_12px_40px_rgba(16,185,129,0.08)] rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 transform relative z-50 ${
          showPopup 
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 text-xs font-bold">
          ✓
        </div>
        <p className="text-xs font-semibold text-neutral-200">
          Password updated securely! Redirecting to login session workspace...
        </p>
      </div>

    </div>
  );
}