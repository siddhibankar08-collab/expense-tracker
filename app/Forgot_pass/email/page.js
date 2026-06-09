"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  // Automatically dismiss the success popup after 4 seconds
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  async function handleResetPassword(e) {
    e.preventDefault();
    setErrorMsg("");
    setShowPopup(false);

    // 1. If email is empty, trigger the red error notification
    if (email.trim() === "") {
      setErrorMsg("Please enter your email address first.");
      return;
    }

    // If text exists but fails syntax check
    if (!isValidEmail) {
      setErrorMsg("Please provide a valid system endpoint email.");
      return;
    }

          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/Forgot_pass/reset_pass`,
          });

          if (error) {
            console.error("resetPasswordForEmail error:", error);
            setErrorMsg(error.message);
            return;
          }
          
    // 2. Trigger the success toast popup beneath the card
    setShowPopup(true);
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#121513] via-[#161C19] to-[#0E100F] text-neutral-100 font-sans antialiased overflow-hidden p-6 gap-4">
      
      {/* SINGLE CENTERED CONTENT CARD */}
      <div className="w-full max-w-md bg-[#030303] rounded-[32px] border border-neutral-800/60 shadow-2xl p-10 flex flex-col justify-center relative overflow-hidden shrink-0">
        
        {/* Soft, visible decorative glow behind card contents */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full space-y-6 relative z-10">
          
          {/* Logo Branding Icon Centered */}
          <div className="flex flex-col items-center justify-center gap-3 text-center">
<div className="p-1.5 bg-black backdrop-blur-sm rounded-xl border border-[#04d292] shadow-sm flex items-center justify-center shrink-0">              <Image
                src="/images/spend.png"
                alt="SpendWise Logo"
                width={50}
                height={50}
              />
            </div>
            <div className="inline-block bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full mt-1">
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                Account Recovery
              </span>
            </div>
          </div>

          {/* Heading Block */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Enter your email address parameters below, and we will transmit a secure verification link to reset your workspace path.
            </p>
          </div>

          {/* Input Form Structure */}
          <form className="space-y-4" onSubmit={handleResetPassword} noValidate>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(""); // Clear errors fluidly as user typed updates
                }}
                className={`w-full h-11 rounded-xl px-4 bg-[#121214] border outline-none transition-all text-sm font-medium text-white placeholder-neutral-600 focus:bg-black focus:ring-4 ${
                  errorMsg 
                    ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/10" 
                    : "border-neutral-800 focus:border-neutral-700 focus:ring-white/5"
                }`}
              />

              {/* Status and Error Response Messages */}
              {errorMsg && (
                <p className="text-red-400 text-xs font-semibold mt-1.5 flex items-center gap-1.5 animate-fadeIn">
                  <span>⚠️</span> {errorMsg}
                </p>
              )}
            </div>

            {/* Execution CTA Button (Always enabled to capture empty clicks) */}
            <button
              type="submit"
              className="w-full h-11 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-md bg-white text-black hover:bg-neutral-200 active:scale-[0.98] shadow-white/5"
            >
              Send Verification Link
            </button>
          </form>

          {/* Core Navigation Hook Back to Start */}
          <div className="text-center pt-1">
            <span 
              onClick={() => router.push("/login")}
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
            >
              ← Back to Login
            </span>
          </div>

          {/* Safety Subscript Note */}
          <p className="text-center text-[10px] font-medium text-neutral-600 leading-relaxed pt-3 border-t border-neutral-900">
            * Verification tokens automatically expire after 10 minutes to minimize secondary route account configuration risks.
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
        {/* Small Green Tick Container */}
        <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 text-xs font-bold">
          ✓
        </div>
        <p className="text-xs font-semibold text-neutral-200">
          Link sent to your email. Please check your inbox configuration.
        </p>
      </div>

    </div>
  );
}