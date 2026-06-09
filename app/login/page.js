"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login error:", error.message);
      return;
    }

    if (data?.session) {
      router.push("/dashboard");
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.log("Google login error:", error.message);
    }
  }

  return (
    <div className="h-screen w-screen flex bg-[#0A0A0C] text-neutral-100 font-sans antialiased overflow-hidden">
      
      {/* LEFT SIDE: Content & Upscaled Cards */}
<div className="hidden lg:flex lg:w-[50%] h-full bg-gradient-to-br from-[#141417] via-[#0d1310] to-[#0A0A0C] p-12 flex-col justify-between relative overflow-hidden border-r border-emerald-950/30">        {/* Ambient background glow */}
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        
        {/* Big Logo & Big Name Branding */}
        <div className="flex items-center gap-5 relative z-10 shrink-0">
          <div className="p-2 bg-emerald-500/5 backdrop-blur-sm rounded-2xl border border-emerald-500/20 shadow-md">
            <Image
              src="/images/spendwiselogo.png"
              alt="SpendWise Logo"
              width={65}
              height={65}
              className="object-contain invert sepia-emerald hue-rotate-60 brightness-125"
            />
          </div>
          <div>
            <h1 className="text-emerald-400 text-xl md:text-2xl font-black tracking-tight leading-none">
                Spend<span className="text-emerald">Wise</span>
              </h1>
            <p className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase mt-1.5">
              Track Smarter • Spend Better
            </p>
          </div>
        </div>

        {/* Hero Title Block & Large Cards Container */}
        <div className="my-auto max-w-xl relative z-10 space-y-8">
          <div>
            <h2 className="text-white text-3xl font-black leading-tight tracking-tight">
              Money clarity <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">
                for life and business.
              </span>
            </h2>
            <p className="text-neutral-400 text-sm mt-3 leading-relaxed font-medium">
              Track personal expenses and manage multiple shops in one place — with powerful analytics and smart reports.
            </p>
          </div>

          {/* Upscaled Highlight Cards Grid */}
          <div className="grid grid-cols-2 gap-5 max-w-[560px]">
            {[
              { icon: "💳", title: "Personal Tracking", desc: "Log daily spending data metrics and stay locked to your budget targets smoothly." },
              { icon: "🏪", title: "Multi-Shop Setup", desc: "Centralize separate retail ledger metrics across all sub-outlets autonomously." },
              { icon: "📈", title: "Smart Analytics", desc: "Unlock immediate visual profit trends, spending allocations, and breakdowns." },
              { icon: "📊", title: "Unified Reports", desc: "Review your personal balances and enterprise distributions in a single anchor." }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-[#121214] border border-neutral-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-neutral-500 hover:-translate-y-1 group shadow-lg"
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

        {/* Legal notice bottom */}
      </div>

      {/* RIGHT SIDE: Every Text and Input made Big */}
      <div className="w-full lg:w-[50%] h-full flex items-center justify-center p-8 relative">
        <div className="w-full max-w-[430px] space-y-6">
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Log in
            </h1>
            <p className="text-sm text-neutral-400 font-medium">
              Welcome back. Enter parameters to view analytics.
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input Block */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-[#121214] rounded-xl px-4 border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 outline-none transition-all text-sm font-medium text-white placeholder-neutral-600"
              />
            </div>

            {/* Password Input Block */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-[#121214] rounded-xl px-4 pr-12 border border-neutral-800 focus:border-neutral-700 focus:bg-black focus:ring-4 focus:ring-white/5 outline-none transition-all text-sm font-medium text-white placeholder-neutral-700"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors text-base"
                >
                  {showPassword ? "✕" : "👁"}
                </button>
              </div>
            </div>

                    {/* Remember Me Parameters */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded-md bg-[#121214] border-neutral-800 text-white focus:ring-0 focus:ring-offset-0 accent-neutral-200"
              />
              <span className="text-sm font-medium text-neutral-400">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={() => router.push("/Forgot_pass/email")}
              className="text-sm font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

            {/* Login Execution CTA */}
            <button
              onClick={handleLogin}
              className="w-full h-12 bg-white hover:bg-neutral-200 text-black text-xs uppercase font-black tracking-widest rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-white/5"
            >
              Login
            </button>
          </form>

          {/* Visual Divider separator line */}
          <div className="flex items-center py-1">
            <div className="flex-1 h-px bg-neutral-800"></div>
            <span className="px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-600">or</span>
            <div className="flex-1 h-px bg-neutral-800"></div>
          </div>

          {/* Google Single Sign-On Button */}
          <div>
            <button
              onClick={handleGoogleLogin} 
              className="w-full h-12 rounded-xl bg-[#121214] hover:bg-[#1C1C1E] border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-3 shadow-sm"
            >
              {/* Original Google SVG Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Navigation Anchor */}
          <div className="text-center pt-1">
            <p className="text-sm text-neutral-500 font-medium">
              Don't have an account?{" "}
              <span
                className="font-bold text-white underline underline-offset-4 cursor-pointer hover:text-neutral-300 transition-colors"
                onClick={() => router.push("/sign_up")}
              >
                Sign up
              </span>
            </p>
          </div>

          <p className="text-center text-xs font-medium text-neutral-600 leading-relaxed pt-2">
            By continuing, you agree to our <br />
            <span className="underline cursor-pointer">Terms of Service</span> & <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>

        </div>
      </div>

    </div>
  );
}