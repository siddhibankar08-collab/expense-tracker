"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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
        
        {/* LEFT SIDE: Full-Span Graphic Illustration Background */}
        <div 
          className="hidden md:block flex-1 h-full bg-cover bg-center bg-no-repeat border-r border-neutral-900"
          style={{ backgroundImage: "url('/images/login-illustration.jpg')" }}
        />

        {/* RIGHT SIDE: Dark Pitch Black Form Panel */}
        <div className="w-full md:w-[480px] h-full bg-[#030303] p-10 flex flex-col justify-center shrink-0 relative z-20 overflow-hidden">
          <div className="w-full space-y-5 my-auto">
            
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-white tracking-tight">
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

          </div>
        </div>

      </div>
    </div>
  );
}